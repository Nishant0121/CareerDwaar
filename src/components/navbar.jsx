import { Menu } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/app.context";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  return (
    <nav className=" bg-gradient-to-r from-primary-orange to-primary-orange/50 bg-primary-orange rounded-full m-2 px-4 p-2 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">CareerDwaar</h1>
        {/* Mobile Menu */}
        <div className="md:hidden">
          <button
            className="bg-transparent hover:bg-gray-500 text-white font-semibold hover:text-white py-2 px-4  rounded"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Menu />
          </button>
          {isOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white-bg rounded-md shadow-lg py-1">
              <Link
                to="/"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/job"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                Jobs
              </Link>
              <Link
                to={user ? "/profile" : "/login"}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                {user ? "Profile" : "Login"}
              </Link>
            </div>
          )}
        </div>
        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-4">
          <Link to="/" className="flex items-center hover:underline">
            Home
          </Link>
          <Link to="/job" className=" flex items-center hover:underline">
            Jobs
          </Link>
          <Link
            to={user ? "/profile" : "/login"}
            className="flex bg-orange-300 rounded-full p-2 items-center space-x-2 hover:underline"
          >
            {/* Display Profile Picture if User is Logged In */}
            {user && user.profilePictureURL ? (
              <img
                src={user.profilePictureURL}
                alt="Profile"
                className="w-8 h-8 rounded-full"
              />
            ) : null}
            <span>{user ? "Profile" : "Login"}</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
