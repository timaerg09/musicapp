import React from "react";

class SearchArtist extends React.Component {
  handleChange = (e) => {
    const query = e.target.value;

    if (!query) {
      fetch("http://localhost:8000/artists/artists-pagination/")
        .then((res) => res.json())
        .then((data) => {
          this.props.onSearchResult(data);
        });
      return;
    }

    fetch(`http://localhost:8000/artists/artists-pagination/${query}`)
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