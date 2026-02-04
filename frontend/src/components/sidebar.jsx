import React from "react";
import { Link } from "react-router-dom";
import { GrHomeRounded } from "react-icons/gr";
import { TbMicrophone2 } from "react-icons/tb";
import { BiAlbum } from "react-icons/bi";

class Sidebar extends React.Component {
  render() {
    return (
      <div className="sidebar">
        <div className="sidebar__container">
          <nav className="sidebar__nav">
            <Link to="/" className="sidebar__nav-logo">
              Music app
            </Link>
            <Link className="sidebar__nav-link" to="/">
              <div className="sidebar__nav-item">
                <GrHomeRounded />
                <span>Home</span>
              </div>
            </Link>
              <Link className="sidebar__nav-link" to="/artists">
            <div className="sidebar__nav-item">
                <TbMicrophone2 />
                <span>Artists</span>
            </div>
              </Link>
              <Link className="sidebar__nav-link" to="/albums">
            <div className="sidebar__nav-item">
                <BiAlbum />
                <span>Albums</span>
            </div>
              </Link>
          </nav>
        </div>
      </div>
    );
  }
}

export default Sidebar;
