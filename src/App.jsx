import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import JobBoard from "./pages/job";
import Login from "./pages/login";
import Layout from "./components/layout";
import { AppProvider } from "./context/app.context";

function App() {
  return (
    <AppProvider>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="job" element={<JobBoard />} />
        </Route>
      </Routes>
    </AppProvider>
  );
}

export default App;
