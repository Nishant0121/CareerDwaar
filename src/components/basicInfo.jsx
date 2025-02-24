import { LogOutIcon } from "lucide-react";
import { useAuth } from "../context/app.context";

export default function BasicInfo() {
  const { user, logout, student, isLoading } = useAuth();

  const handleLogout = async () => {
    await logout();
    window.location.href = "/login";
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-3xl flex items-center justify-center">
        <div className="animate-spin h-5 w-5 border-b-2 border-blue-500 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-3xl">
      {/* Profile Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="flex items-center space-x-4 justify-center md:col-span-1">
          {/* Profile Picture */}
          <div className="relative h-24 w-24">
            <img
              src={user.profilePictureURL}
              alt={user.name}
              className="h-24 w-24 object-cover rounded-full border-4 border-white shadow-lg"
            />
            <div
              className={`h-5 w-5 ${
                user?.role === "student" ? "bg-blue-500" : "bg-green-500"
              } z-10 rounded-full absolute bottom-0 right-0 border-2 border-white`}
            ></div>
          </div>
          <div>
            <h2 className="text-2xl font-semibold">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>

        {/* Logout Button */}
        <div className="md:col-span-2 flex justify-center md:justify-end">
          <button
            className="flex items-center bg-red-500 text-white rounded-full px-6 py-3 hover:bg-red-600 transition-all duration-200 shadow-lg"
            onClick={handleLogout}
          >
            <LogOutIcon className="mr-2" />
            Logout
          </button>
        </div>
      </div>

      {/* User Since Section */}
      <div className="mt-8 border-t pt-6 text-center md:text-left">
        <h3 className="text-lg font-semibold">User Since:</h3>
        <p className="text-gray-600">
          {new Intl.DateTimeFormat("en-GB", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          }).format(new Date(user.createdAt))}
        </p>
      </div>

      {/* Additional Student Details */}
      {student && (
        <div className="mt-8 border-t pt-6">
          <h3 className="text-xl font-semibold mb-4">
            {user?.role === "student" ? "Student Details" : "Enployer Details"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* College Name */}
            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-600">College:</span>
              <p className="text-gray-800">{student.college_name}</p>
            </div>

            {/* Branch */}
            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-600">Branch:</span>
              <p className="text-gray-800">{student.branch}</p>
            </div>

            {/* Resume Link */}
            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-600">Resume:</span>
              <a
                href={student.resume_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700"
              >
                View Resume
              </a>
            </div>

            {/* Verified Status */}
            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-600">Verified:</span>
              <p className="text-gray-800">
                {student.is_verified ? "Yes" : "No"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
