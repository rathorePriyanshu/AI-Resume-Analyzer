import { Link, useNavigate } from "react-router";
import { CgProfile } from "react-icons/cg";
import { useState } from "react";
import { useUserStore } from "~/lib/puter";

const NavBar = () => {
  const navigate = useNavigate();
  const user = useUserStore((s) => s.auth.user);
  const signOut = useUserStore((s) => s.auth.signOut);

  const [open, setOpen] = useState(false);

  const handleLogOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <Link to="/">
        <p className="font-bold text-2xl text-gradient hidden sm:block">
          Resumetrics
        </p>
      </Link>
      <div className="flex items-center sm:justify-end justify-between w-full gap-2">
        <div>
          <Link to="/upload" className="primary-button w-fit">
            Upload Resume
          </Link>
        </div>
        <div>
          <button
            onClick={() => setOpen(!open)}
            className="primary-button w-fit px-3 relative font-medium transition"
          >
            {CgProfile({ size: 22 })}
          </button>
        </div>

        {open && (
          <div className="absolute right-18 mt-38 w-40 bg-white shadow-lg rounded-lg p-2">
            {user ? (
              <button
                onClick={handleLogOut}
                className="w-full text-left mb-1 px-3 py-2 border rounded-lg outline-none hover:cursor-pointer hover:bg-gray-300"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => navigate("/auth")}
                className="w-full text-left mb-1 px-3 py-2 border rounded-lg outline-none hover:cursor-pointer hover:bg-gray-300"
              >
                Login
              </button>
            )}
            <button
              onClick={() => navigate("/signup")}
              className="w-full text-left mb-1 px-3 py-2 border rounded-lg outline-none hover:cursor-pointer hover:bg-gray-300"
            >
              Sign Up
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
