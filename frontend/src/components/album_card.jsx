import React from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { RiEditCircleLine } from "react-icons/ri";

class Album_Card extends React.Component {
  render() {
    return (
      <div className="album__card">
        <div className="card-container">
          <img alt="" src={this.props.cover_url} className="card-image"></img>
          <div className="album__card-title">{this.props.title}</div>
          <div className="album__card-year">{this.props.year}</div>
          <div className="album__card-artists">{this.props.artists}</div>
          <div className="album__card-actions">
            {this.props.onDelete && (
              <IoIosCloseCircleOutline className="delete-album--icon" onClick={this.props.onDelete} />
            )}
            {this.props.onEdit && (
              <RiEditCircleLine className="edit-album--icon" onClick={this.props.onEdit} />
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Album_Card;
