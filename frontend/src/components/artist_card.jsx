import React from "react";
import { Link } from "react-router-dom";

class Artist_Card extends React.Component {
  render() {
    return (
      <Link to={`/artists/${this.props.id}`}>
        <div className="artist__card">
          <div className="card-container">
            <img alt="" src={this.props.image_url} className="card-image"></img>
            <div className="artist__card-nickname">{this.props.nickname}</div>
            <div className="artist__card-name">{this.props.name}</div>
          </div>
        </div>
      </Link>
    );
  }
}

export default Artist_Card;
