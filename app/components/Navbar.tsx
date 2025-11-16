import { Link } from "react-router";

const NavBar = () => {
  return (
    <nav className="navbar">
      <Link to="/">
        <p className="font-bold text-2xl text-gradient">Resumetrics</p>
      </Link>
      <Link to="/upload" className="primary-button w-fit">
        Upload Resume
      </Link>
    </nav>
  );
};

export default NavBar;
