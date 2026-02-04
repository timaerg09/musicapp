import "./css/reset.css";
import "./css/main.css";
import Sidebar from "./components/sidebar";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <div className="layout">
      <Sidebar />
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
}

export default App;
