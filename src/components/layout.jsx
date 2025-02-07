import { Outlet } from "react-router-dom";

import Navbar from "./navbar";
import Footer from "./footer";

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>

      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
