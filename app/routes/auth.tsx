import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import { supabase } from "~/lib/supabaseClient";

export const meta = () => [
  { title: "Resumind | Auth" },
  { name: "description", content: "login to your account" },
];

const Auth = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>();
  const location = useLocation();
  // const next = location.search.split("next=")[1];
  const navigate = useNavigate();

  const param = new URLSearchParams(location.search);
  const nextparam = param.get("next");

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>();

  useEffect(() => {
    const checkUser = async () => {
      setLoading(true);
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setUser(data.user);
        if (nextparam) {
          navigate(nextparam, { replace: true });
        }
      }
      setLoading(false);
    };

    checkUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setUser(session?.user);
          if (nextparam) {
            navigate(nextparam, { replace: true });
          }
        } else {
          setUser(null);
        }
      }
    );

    return () => listener.subscription.unsubscribe();
  }, [navigate, nextparam]);

  const OnSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

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
    supabase.auth.signOut();
    setUser(null);
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
    <div className="bg-[url('./images/bg-main.svg')] bg-cover min-h-screen flex items-center justify-center">
      <div className="gradient-border shadow-lg">
        <section className="flex flex-col bg-white gap-10 p-10 rounded-2xl">
          <div className="flex flex-col gap-2 items-center text-center">
            <h1>Welcome</h1>
            <h2>Login To Begin Your Job Journey</h2>
          </div>
          {!user ? (
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

              <div className="flex flex-col mt-4 items-center justify-center">
                {loading ? (
                  <button className="auth-button animate-pulse touch-none">
                    Redirecting...
                  </button>
                ) : (
                  <button type="submit" className="auth-button">
                    Login
                  </button>
                )}

                <div className="mt-4">
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
          ) : (
            <button onClick={handleLogin} className="auth-button">
              Logout
            </button>
          )}
        </section>
      </div>
    </div>
  );
};

export default Auth;
