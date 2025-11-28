import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { useUserStore } from "~/lib/State";
import { supabase } from "~/lib/supabaseClient";

export const meta = () => [
  { title: "Resumind | Auth" },
  { name: "description", content: "login to your account" },
];

const Auth = () => {
  const [loading, setLoading] = useState(true);
  const signOut = useUserStore((s) => s.auth.signOut);
  const signIn = useUserStore((s) => s.auth.signIn);
  const user = useUserStore((s) => s.auth.user);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>();

  useEffect(() => {
    setLoading(false);
  }, []);

  const OnSubmit = async (data: FormData) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      await signIn(data.email, data.password);

      if (error) {
        setError("email", { message: error.message });
        return;
      }
      navigate("/");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <img
          src="/images/resume-scan.gif"
          alt="scanner"
          className="w-[200px]"
        />
      </div>
    );
  }

  return (
    <div className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen">
      <nav className="resume-nav">
        <Link to="/" className="back-button">
          <img src="/icons/back.svg" alt="logo" className="w-2.5 h-2.5" />
          <span className="text-gray-800 font-semibold text-sm">
            Back To Home
          </span>
        </Link>
      </nav>

      <div className="flex items-center justify-center">
        {!user ? (
          <div className="gradient-border shadow-lg">
            <section className="flex flex-col bg-white gap-10 px-10 py-7 rounded-2xl">
              <div className="flex flex-col gap-2 items-center text-center">
                <h1>Welcome</h1>
                <h2>Login To Begin Your Job Journey</h2>
              </div>

              <form onSubmit={handleSubmit(OnSubmit)}>
                <div className="w-full flex flex-col">
                  <label htmlFor="email" className="mb-1 mx-1 font-medium">
                    Email
                  </label>
                  <input
                    {...register("email", { required: "Email is Required*" })}
                    id="email"
                    type="email"
                    placeholder="abc@gmai.com"
                  />
                  {errors.email && (
                    <p className="text-red-400 mt-2 mx-2 font-light text-sm">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div className="w-full flex flex-col">
                  <label
                    htmlFor="password"
                    className="mb-1 mx-1 font-medium
               "
                  >
                    Password
                  </label>
                  <input
                    {...register("password", {
                      required: "Password is Required*",
                    })}
                    id="password"
                    type="password"
                    placeholder="password"
                  />
                  {errors.password && (
                    <p className="text-red-400 mt-2 mx-2 font-light text-sm">
                      {errors.password.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col w-full mt-2 items-center justify-center">
                  {loading ? (
                    <button className="auth-button animate-pulse touch-none">
                      Redirecting...
                    </button>
                  ) : (
                    <button type="submit" className="auth-button">
                      Login
                    </button>
                  )}
                  <div className="mt-3">
                    <p>
                      Don't have an account?{" "}
                      <Link
                        to="/signup"
                        className="text-blue-500 hover:underline"
                      >
                        Create One
                      </Link>
                    </p>
                  </div>
                </div>
              </form>
            </section>
          </div>
        ) : (
          <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
            <div className="gradient-border shadow-lg">
              <div className="flex flex-col bg-white p-10 rounded-2xl gap-4 items-center text-center">
                <h1>Welcome Back!</h1>
                <button
                  onClick={handleLogin}
                  className="auth-button mt-4 w-full"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;
