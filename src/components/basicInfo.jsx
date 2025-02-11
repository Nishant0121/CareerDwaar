import { LogOutIcon } from "lucide-react";
import { useAuth } from "../context/app.context";

export default function BasicInfo() {
  // In a real app, fetch this data from your API
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    window.location.href = "/login";
  };

  return (
    <>
      <div className=" grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center space-x-4">
          <div className="h-20 w-20">
            <img src={user.profilePictureURL} alt={user.name} />
          </div>
          <div>
            <h2 className="text-2xl font-semibold">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>

        <button
          className="bg-red-500 max-w-fit flex items-center max-h-fit rounded-4xl text-white  hover:bg-red-600 px-4 py-2 "
          onClick={handleLogout}
        >
          <LogOutIcon />
          Logout
        </button>
      </div>

      <div className="mt-4 flex items-center space-x-4">
        <h3 className="text-lg font-semibold">User Since :</h3>
        <p className="text-gray-600">
          {new Intl.DateTimeFormat("en-GB", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          }).format(new Date(user.createdAt))}
        </p>
      </div>
    </>
  );
}
