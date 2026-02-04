import React from "react";

class Album_Card extends React.Component {
  render() {
    return (
      <div className="album__card">
        <div className="card-container">
          <img
            alt=""
            src={this.props.cover_url}
            className="card-image"
          ></img>
          <div className="album__card-title">{this.props.title}</div>
          <div className="album__card-year">{this.props.year}</div>
        </div>
      </div>
    );
  }
}

export default Album_Card;
