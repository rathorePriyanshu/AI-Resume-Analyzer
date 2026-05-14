import { create } from "zustand";
import { supabase } from "./supabaseClient";
import Tesseract from "tesseract.js";
import { OpenAI } from "openai";

const BUCKET = "Uploads";
const KV_BUCKET = BUCKET;
const hfClient = new OpenAI({
  baseURL: "https://router.huggingface.co/v1",
  apiKey: import.meta.env.VITE_HF_TOKEN,
  dangerouslyAllowBrowser: true,
});
type UploadedFile = { Key: string; [key: string]: any };

// declare global {
//   interface Window {
//     puter: {
//       auth: {
//         getUser: () => Promise<AuthUser>;
//         isSignedIn: () => Promise<boolean>;
//         signIn: () => Promise<void>;
//         signOut: () => Promise<void>;
//       };
//       fs: {
//         write: (
//           path: string,
//           data: string | File | Blob
//         ) => Promise<File | undefined>;
//         read: (path: string) => Promise<Blob>;
//         upload: (file: File[] | Blob[]) => Promise<any>;
//         delete: (path: string) => Promise<void>;
//         readdir: (path: string) => Promise<any[] | undefined>;
//       };
//       ai: {
//         // chat: (
//         //   prompt: string | ChatMessage[],
//         //   imageURL?: string | ChatOptions,
//         //   testMode?: boolean,
//         //   options?: ChatOptions
//         // ) => Promise<Object>;
//         img2txt: (
//           image: string | File | Blob,
//           testMode?: boolean
//         ) => Promise<string>;
//       };
//       kv: {
//         get: (key: string) => Promise<string | null>;
//         set: (key: string, value: string) => Promise<boolean>;
//         delete: (key: string) => Promise<boolean>;
//         list: (pattern: string, returnValues?: boolean) => Promise<string[]>;
//         flush: () => Promise<boolean>;
//       };
//     };
//   }
// }

interface UserStore {
  isLoading: boolean;
  error: string | null;
  supabaseReady: boolean;
  auth: {
    user: AuthUser | null;
    isAuthenticated: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    refreshUser: () => Promise<void>;
    checkAuthStatus: () => Promise<boolean>;
    getUser: () => AuthUser | null;
  };
  fs: {
    write: (
      path: string,
      data: string | File | Blob,
    ) => Promise<File | undefined>;
    read: (path: string) => Promise<Blob | undefined>;
    upload: (file: File[] | Blob[]) => Promise<any | undefined>;
    delete: (path: string) => Promise<void>;
    readDir: () => Promise<any[] | undefined>;
  };
  ai: {
    // chat: (
    //   prompt: string | ChatMessage[],
    //   imageURL?: string | ChatOptions,
    //   testMode?: boolean,
    //   options?: ChatOptions
    // ) => Promise<AIResponse | undefined>;
    feedback: (
      path: string,
      message: string,
    ) => Promise<AIResponse | undefined>;
    img2txt: (
      image: string | File | Blob,
      testMode?: boolean,
    ) => Promise<string | undefined>;
  };
  kv: {
    get: (key: string) => Promise<string | null | undefined>;
    set: (key: string, value: string) => Promise<boolean | undefined>;
    delete: (key: string) => Promise<boolean | undefined>;
    list: (
      pattern: string,
      returnValues?: boolean,
    ) => Promise<string[] | KVItem[] | undefined>;
    flush: () => Promise<boolean | undefined>;
  };

  init: () => Promise<void>;
  clearError: () => void;
}

export const useUserStore = create<UserStore>((set, get): UserStore => {
  const setError = (msg: string) => {
    set({
      error: msg,
      isLoading: false,
      supabaseReady: true,
      auth: {
        user: null,
        isAuthenticated: false,
        signIn: get().auth.signIn,
        signOut: get().auth.signOut,
        refreshUser: get().auth.refreshUser,
        checkAuthStatus: get().auth.checkAuthStatus,
        getUser: get().auth.getUser,
      },
    });
  };

  const checkAuthStatus = async (): Promise<boolean> => {
    set({ isLoading: true, error: null });

    try {
      const { data: sessionData, error } = await supabase.auth.getSession();
      if (error) throw error;

      const session = sessionData.session;

      // ❌ user is not logged in
      if (!session) {
        set({
          auth: {
            user: null,
            isAuthenticated: false,
            signIn: get().auth.signIn,
            signOut: get().auth.signOut,
            refreshUser: get().auth.refreshUser,
            checkAuthStatus: get().auth.checkAuthStatus,
            getUser: () => null,
          },
          isLoading: false,
        });
        return false;
      }

      // ✅ user is logged in
      const user = session.user;
      set({
        auth: {
          user: { id: user.id, email: user.email },
          isAuthenticated: true,
          signIn: get().auth.signIn,
          signOut: get().auth.signOut,
          refreshUser: get().auth.refreshUser,
          checkAuthStatus: get().auth.checkAuthStatus,
          getUser: () => user,
        },
        isLoading: false,
      });

      return true;
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to check auth status";
      set({
        error: msg,
        auth: {
          user: null,
          isAuthenticated: false,
          signIn: get().auth.signIn,
          signOut: get().auth.signOut,
          refreshUser: get().auth.refreshUser,
          checkAuthStatus: get().auth.checkAuthStatus,
          getUser: () => null,
        },
        isLoading: false,
      });
      return false;
    }
  };

  const signIn = async (email: string, password: string): Promise<void> => {
    console.log("➡️ signIn() called from UI");

    set({ isLoading: true, error: null });

    try {
      console.log("📡 calling puter.auth.signIn()");
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      console.log("✅ signIn completed");
      await checkAuthStatus();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Sign in failed";
      console.error("❌ signIn error:", msg);
      setError(msg);
    }
  };

  const signOut = async (): Promise<void> => {
    set({ isLoading: true, error: null });

    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({
        auth: {
          user: null,
          isAuthenticated: false,
          signIn: get().auth.signIn,
          signOut: get().auth.signOut,
          refreshUser: get().auth.refreshUser,
          checkAuthStatus: get().auth.checkAuthStatus,
          getUser: () => null,
        },
        isLoading: false,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Sign out failed";
      setError(msg);
    }
  };

  const refreshUser = async (): Promise<void> => {
    set({ isLoading: true, error: null });

    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;

      if (data.user) {
        const user = { id: data.user.id, email: data.user.email };
        set({
          auth: {
            user,
            isAuthenticated: true,
            signIn: get().auth.signIn,
            signOut: get().auth.signOut,
            refreshUser: get().auth.refreshUser,
            checkAuthStatus: get().auth.checkAuthStatus,
            getUser: () => user,
          },
          isLoading: false,
        });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to refresh user";
      setError(msg);
    }
  };

  const init = async (): Promise<void> => {
    try {
      set({ supabaseReady: true });
      checkAuthStatus();
      return;
    } catch (err) {
      setError("Supabase failed to initialize");
      set({
        supabaseReady: false,
        isLoading: false,
        error: "Supabase failed to initialize",
      });
    }
  };

  const write = async (path: string, data: string | File | Blob) => {
    const user = get().auth.user;
    const folder = user ? `${user.id}/` : "public/";
    const filename = path.split("/").pop() ?? "file.txt";
    const fullPath = folder + filename;

    let file: File;

    if (data instanceof Blob && !(data instanceof File)) {
      file = new File([data], filename);
    } else if (typeof data === "string") {
      file = new File([data], filename, {
        type: "text/plain",
      });
    } else {
      file = data as File;
    }

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(fullPath, file, { upsert: true });
    if (error) throw error;

    return file;
  };

  const readDir = async () => {
    const user = get().auth.user;
    const folder = user ? `${user.id}/` : "public/";

    const { data, error } = await supabase.storage.from(BUCKET).list(folder);

    if (error) throw error;

    return data;
  };

  const readFile = async (path: string) => {
    const user = get().auth.user;
    const folder = user ? `${user.id}/` : "public/";
    const fullPath = folder + path;

    const { data, error } = await supabase.storage
      .from(BUCKET)
      .download(fullPath);

    if (error) {
      throw error;
    }
    if (!data) {
      throw new Error(`File not found in storage: ${fullPath}`);
    }
    return data;
  };

  const upload = async (files: File[] | Blob[]): Promise<UploadedFile[]> => {
    const user = get().auth.user;
    const folder = user ? `${user.id}/` : "public/";

    const results = await Promise.all(
      files.map(async (f) => {
        const file =
          f instanceof Blob && !(f instanceof File)
            ? new File([f], "upload")
            : (f as File);

        const fullPath = folder + file.name;

        const { data, error } = await supabase.storage
          .from(BUCKET)
          .upload(fullPath, file, { upsert: true });

        if (error) throw error;

        return { Key: fullPath, ...data };
      }),
    );

    return results;
  };

  const deleteFile = async (filename: string) => {
    const user = get().auth.user;
    const folder = user ? `${user.id}/` : "public/";
    const fullPath = folder + filename;

    const { error } = await supabase.storage.from(BUCKET).remove([fullPath]);
    if (error) throw error;
  };

  // const chat = async (
  //   prompt: string | ChatMessage[],
  //   imageURL?: string | ChatOptions,
  //   testMode?: boolean,
  //   options?: ChatOptions
  // ) => {
  //   // return puter.ai.chat(prompt, imageURL, testMode, options);
  //   return puter.ai.chat(prompt, imageURL, testMode, options) as Promise<
  //     AIResponse | undefined
  //   >;
  // };

  const feedback = async (extractedText: string, message: string) => {
    try {
      const chatCompletion = await hfClient.chat.completions.create({
        model: "deepseek-ai/DeepSeek-V3.1-Terminus:novita",
        messages: [
          {
            role: "user",
            content: `Resume content:\n${extractedText}\n\nUser message:\n${message}`,
          },
        ],
      });

      const choice = chatCompletion.choices[0].message;

      const aiResponse: AIResponse = {
        message: {
          role: choice.role,
          content: choice.content,
          refusal: choice.refusal,
          annotations: choice.annotations,
        },
        logprobs: null, // placeholder
        finish_reason: "stop", // placeholder
        usage: [
          {
            type: "prompt",
            model: "Qwen3-Next-80B-A3B-Instruct",
            amount: 0,
            cost: 0,
          },
        ],
        via_ai_chat_service: true,
      };

      console.log("AI Feedback Response:", aiResponse);
      return aiResponse;
    } catch (err) {
      console.error("AI Feedback Error", err);
      return undefined;
    }
  };

  const img2txt = async (image: string | File | Blob, testMode?: boolean) => {
    try {
      let imgData: string | File | Blob;

      if (typeof image === "string") {
        const res = await fetch(image);
        const blobData = await res.blob();
        imgData = new File([blobData], "image.png", { type: blobData.type });
      } else {
        imgData = image;
      }

      const result = await Tesseract.recognize(imgData, "eng", {
        logger: (m) => {
          if (testMode) console.log("Tesseract:", m);
        },
      });

      return result.data.text.trim();
    } catch (err) {
      console.error("img2txt error:", err);
      return undefined;
    }
  };

  const getKV = async (key: string) => {
    try {
      const user = get().auth.user;
      const fullPath = user
        ? `kv/resume:${key}.txt`
        : `public/resume:${key}.txt`;

      console.log("USER:", user);
      console.log("PATH:", fullPath);

      const { data, error } = await supabase.storage
        .from(KV_BUCKET)
        .download(fullPath);
      if (error) {
        if (error.message.includes("Not Found")) return null;
        throw error;
      }

      if (!data) return null;

      const text = await data.text();
      return text;
    } catch (err) {
      console.error("getKV error:", err);
      return null;
    }
  };

  const setKV = async (key: string, value: string) => {
    try {
      const file = new File([value], `${key}.txt`, { type: "text/plain" });

      const user = get().auth.user;
      const fullPath = user
        ? `kv/resume:${key}.txt`
        : `public/resume:${key}.txt`;

      const { error } = await supabase.storage
        .from(KV_BUCKET)
        .upload(fullPath, file, { upsert: true });

      if (error) throw error;

      return true;
    } catch (err) {
      console.error("setKV error:", err);
      return false;
    }
  };

  const deleteKV = async (key: string) => {
    try {
      const { error } = await supabase.storage
        .from(KV_BUCKET)
        .remove([`kv/resume:${key}.txt`]);
      if (error) throw error;
      return true;
    } catch (err) {
      console.error("deleteKV error:", err);
      return false;
    }
  };

  const listKV = async (pattern: string, returnValues?: boolean) => {
    try {
      const { data, error } = await supabase.storage
        .from(KV_BUCKET)
        .list("kv/");
      if (error) throw error;

      let keys = data.map((f) =>
        f.name.replace("resume:", "").replace(".txt", ""),
      );

      if (pattern) {
        const regex = new RegExp(pattern);
        keys = keys.filter((k) => regex.test(k));
      }

      if (returnValues) {
        const result: string[] = [];
        for (const key of keys) {
          const value = await getKV(key);
          if (value !== null) result.push(value);
        }
        return result;
      }
      return keys;
    } catch (err) {
      console.error("listKV error:", err);
      return [];
    }
  };

  const flushKV = async () => {
    try {
      const { data, error } = await supabase.storage
        .from(KV_BUCKET)
        .list("kv/");
      if (error) throw error;

      const files = data.map((f) => `kv/${f.name}`);
      if (files.length > 0) {
        const { error: delError } = await supabase.storage
          .from(KV_BUCKET)
          .remove(files);
        if (delError) throw delError;
      }
      return true;
    } catch (err) {
      console.error("flushKV error:", err);
      return false;
    }
  };

  return {
    isLoading: true,
    error: null,
    supabaseReady: false,
    auth: {
      user: null,
      isAuthenticated: false,
      signIn,
      signOut,
      refreshUser,
      checkAuthStatus,
      getUser: () => get().auth.user,
    },
    fs: {
      write: (path: string, data: string | File | Blob) => write(path, data),
      read: (path: string) => readFile(path),
      readDir: () => readDir(),
      upload: (files: File[] | Blob[]) => upload(files),
      delete: (path: string) => deleteFile(path),
    },
    ai: {
      // chat: (
      //   prompt: string | ChatMessage[],
      //   imageURL?: string | ChatOptions,
      //   testMode?: boolean,
      //   options?: ChatOptions
      feedback: (path: string, message: string) => feedback(path, message),
      img2txt: (image: string | File | Blob, testMode?: boolean) =>
        img2txt(image, testMode),
    },
    kv: {
      get: (key: string) => getKV(key),
      set: (key: string, value: string) => setKV(key, value),
      delete: (key: string) => deleteKV(key),
      list: (pattern: string, returnValues?: boolean) =>
        listKV(pattern, returnValues),
      flush: () => flushKV(),
    },
    init,
    clearError: () => set({ error: null }),
  };
});
