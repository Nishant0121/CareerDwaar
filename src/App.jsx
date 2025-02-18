import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import JobBoard from "./pages/job";
import Login from "./pages/login";
import Layout from "./components/layout";
import AddJob from "./pages/addjobs";
import { useAuth } from "./context/app.context";
import UserProfile from "./pages/userProfile";
import RegisterPage from "./pages/registerpage";
import Dashbord from "./pages/dashbord";

function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="login" element={user ? <Navigate to="/" /> : <Login />} />
      <Route
        path="register"
        element={user ? <Navigate to="/" /> : <RegisterPage />}
      />
      {user ? (
        <Route path="/" element={<Layout />}>
          <Route index element={user ? <Home /> : <Navigate to="/login" />} />
          <Route
            path="add-job"
            element={user ? <AddJob /> : <Navigate to="/login" />}
          />
          <Route
            path="job"
            element={user ? <JobBoard /> : <Navigate to="/login" />}
          />
          <Route
            path="profile"
            element={user ? <UserProfile /> : <Navigate to="/login" />}
          />
          <Route
            path="dashboard"
            element={
              user?.role === "employer" || user?.role === "employee" ? (
                <Dashbord />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Route>
      ) : (
        <Route path="/" element={<Login />} />
      )}
    </Routes>
  );
}

export default App;
