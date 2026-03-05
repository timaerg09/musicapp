import React from "react";
import API_URL from "../config";

// форма поиска артистов
class SearchArtist extends React.Component {
  handleChange = (e) => {
    const query = e.target.value;

    if (!query) {
      this.props.onSearchResult(null);
      return;
    }

    fetch(`${API_URL}/artists/artists-pagination/${query}`)
      .then((res) => res.json())
      .then((data) => {
        this.props.onSearchResult(data);
      });
  };

  render() {
    return (
      <div className="search__artist">
        <input placeholder="Search something..." className="search__artist-input" name="name" onChange={this.handleChange} />
      </div>
    );
  }
}

export default SearchArtist;