import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { supabase } from "~/lib/supabaseClient";

const signup = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>();

  const OnSubmit = async (data: FormData) => {
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });

    if (error) {
      setError("email", { message: error.message });
    } else {
      navigate("/auth");
    }
  };

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
      <div className="flex items-center justify-center ">
        <div className="gradient-border shadow-lg">
          <section className="flex flex-col bg-white gap-5 px-10 py-2 rounded-2xl">
            <div className="flex flex-col items-center text-center">
              <h1>Welcome</h1>
              <h2>SignUp to Create an Account</h2>
            </div>
            <form onSubmit={handleSubmit(OnSubmit)}>
              <div className="w-full flex flex-col">
                <label htmlFor="name" className=" mx-1 font-medium">
                  Name
                </label>
                <input
                  {...register("name", { required: "Name is Required*" })}
                  id="name"
                  type="text"
                  placeholder="your name..."
                />
                {errors.name && (
                  <p className="text-red-400 mt-1 mx-2 font-light text-sm">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div className="w-full flex flex-col">
                <label htmlFor="email" className=" mx-1 font-medium">
                  Email
                </label>
                <input
                  {...register("email", { required: "Email is Required*" })}
                  id="email"
                  type="email"
                  placeholder="abc@gmai.com"
                />
                {errors.email && (
                  <p className="text-red-400 mt-1 mx-2 font-light text-sm">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div className="w-full flex flex-col">
                <label
                  htmlFor="password"
                  className="mx-1 font-medium
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
                  <p className="text-red-400 mt-1 mx-2 font-light text-sm">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col w-full mt-1 items-center justify-center">
                <button type="submit" className="auth-button">
                  Create Account
                </button>
                <div className="mt-2">
                  <p>
                    Already have an account?{"  "}
                    <Link
                      to="/auth"
                      className="text-blue-500 mx-0.5 hover:underline"
                    >
                      Login
                    </Link>
                  </p>
                </div>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
};

export default signup;
