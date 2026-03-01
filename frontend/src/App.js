import "./scss/main.scss";
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
