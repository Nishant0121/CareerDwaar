import { Link } from "react-router-dom";
import BasicInfo from "../components/basicInfo";
import SavedJobs from "../components/savedJobs";
import { useAuth } from "../context/app.context";

export default function UserProfile() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold mb-6">User Profile</h1>
      <BasicInfo />
      {user?.role === "student" ? (
        ""
      ) : (
        <div className="flex space-x-2 justify-center">
          <Link
            to={"/dashboard"}
            className="bg-primary-orange text-white hover:bg-primary/90 px-6 py-3 rounded-4xl  text-lg font-medium transition-colors"
          >
            Dashboard
          </Link>
          <Link
            to={"/add-job"}
            className="bg-transparent text-black border border-primary-orange hover:bg-primary/90 px-6 py-3 rounded-4xl  text-lg font-medium transition-colors"
          >
            Add Job
          </Link>
        </div>
      )}

      <SavedJobs />
    </div>
  );
}
