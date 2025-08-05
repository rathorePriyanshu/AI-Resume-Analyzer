import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";

export const meta = () => [
  { title: "Resumind | Auth" },
  { name: "description", content: "login to youer account" },
];

const Auth = () => {
  const { isLoading, auth } = usePuterStore();
  const location = useLocation();
  const next = location.search.split("next=")[1];
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.isAuthenticated) navigate(next);
  }, [auth.isAuthenticated, next]);

  return (
    <div className="bg-[url('./images/bg-main.svg')] bg-cover min-h-screen flex items-center justify-center">
      <div className="gradient-border shadow-lg">
        <section className="flex flex-col bg-white gap-8 p-10 rounded-2xl">
          <div className="flex flex-col gap-2 items-center text-center">
            <h1>Welcome</h1>
            <h2>Login To Begin Your Job Journey</h2>
          </div>
          {isLoading ? (
            <button className="auth-button animate-pulse">
              <p>Signing you in...</p>
            </button>
          ) : (
            <>
              {auth.isAuthenticated ? (
                <button
                  className="auth-button"
                  onClick={() => {
                    console.log("Logout");
                    auth.signOut();
                  }}
                >
                  <p>Logout</p>
                </button>
              ) : (
                <button
                  className="auth-button"
                  onClick={() => {
                    console.log("Login");
                    auth.signIn();
                  }}
                >
                  <p>Login</p>
                </button>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default Auth;
