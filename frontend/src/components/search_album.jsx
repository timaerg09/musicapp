import React from "react";

class SearchAlbum extends React.Component {
  handleChange = (e) => {
    const query = e.target.value;

    if (!query) {
      this.props.onSearchResult(null);
      return;
    }

    fetch(`http://localhost:8000/albums/albums-pagination/${query}`)
      .then((res) => res.json())
      .then((data) => {
        this.props.onSearchResult(data);
      });
  };

  render() {
    return (
      <div className="search__album">
        <input
          placeholder="Search something..."
          className="search__album-input"
          name="name"
          onChange={this.handleChange}
        />
      </div>
    );
  }
}

export default SearchAlbum;
