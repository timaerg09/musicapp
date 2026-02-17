import React from "react";

class CreateAlbum extends React.Component {
  state = {
    title: "",
    year: "",
    cover_url: "",
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSumbit = (e) => {
    e.preventDefault();
    const { title, year, cover_url } = this.state;
    fetch("http://localhost:8000/albums/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, year, cover_url }),
    }).then(() => {
      window.location.reload();
    });
    this.setState({ title: "", year: "", cover_url: "" });
  };

  render() {
    const { showForm } = this.props;
    return (
      <div className={"create-album"}>
        <form
          className={`create-album__form ${showForm ? "create-album__form--active" : ""}`}
          onSubmit={this.handleSumbit}
        >
          <div className="create-album__form-item">
            <label htmlFor="title">Title</label>
            <input
              name="title"
              value={this.state.title}
              onChange={this.handleChange}
            />
          </div>
          <div className="create-album__form-item">
            <label htmlFor="year">Year</label>
            <input
              name="year"
              type="number"
              min="1900"
              max={new Date().getFullYear()}
              value={this.state.year}
              onChange={this.handleChange}
            />
          </div>
          <div className="create-album__form-item">
            <label htmlFor="cover_url">Cover_url</label>
            <input
              name="cover_url"
              value={this.state.cover_url}
              onChange={this.handleChange}
            />
          </div>

          <button type="submit">Add album</button>
        </form>
      </div>
    );
  }
}

export default CreateAlbum;
