import AppRoutes from "./routes/AppRoutes";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  return (
    <>
      {/* ✅ App Container */}
      <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
        {/* ✅ Main App Layout */}
        <div className="flex flex-1">
          {/* Sidebar */}
          <aside className="hidden md:block">
            <Sidebar />
          </aside>

          {/* Main Content Area */}
          <div className="flex flex-col flex-1 ml-0 md:ml-60 transition-all duration-300">
            <Header />
            <main className="flex-1 p-4 overflow-y-auto">
              <AppRoutes />
            </main>
            <Footer />
          </div>
        </div>
      </div>

      {/* ✅ Global Toast Notifications */}
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
      />
    </>
  );
}
