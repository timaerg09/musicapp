import React from "react";
import ArtistCreate from "../components/create_artist";
import { IoIosAddCircleOutline } from "react-icons/io";
import ArtistCard from "../components/artist_card";
import SearchArtist from "../components/search_artist";
import API_URL from "../config";

class Artists extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      artists: [],
      showForm: false,
      currentPage: 1,
      limit: 8,
      totalPages: 0,
      isSearching: false,
    };
    this.handleSearchResult = this.handleSearchResult.bind(this);
  }
  fetchArtists = () => {
    const skip = (this.state.currentPage - 1) * this.state.limit;
    fetch(
      `${API_URL}/artists/artists-pagination/?skip=${skip}&limit=${this.state.limit}`,
    )
      .then((res) => res.json())
      .then((data) => {
        this.setState({ artists: data });
      });
  };
  componentDidMount() {
    fetch(`${API_URL}/artists/get/count`)
      .then((res) => res.json())
      .then((data) => {
        this.setState({ totalPages: Math.ceil(data / this.state.limit) });
      });
    this.fetchArtists();
  }

  getPageNumbers = () => {
    const { currentPage, totalPages } = this.state;
    const pages = [];

    for (let i = 1; i <= totalPages; i++) {
      if (
        i <= 2 ||
        i >= totalPages - 1 ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "...") {
        pages.push("...");
      }
    }

    return pages;
  };
  handlePageChange = (page) => {
    this.setState({ currentPage: page }, () => {
      this.fetchArtists();
    });
  };
  handleAddForm = (e) => {
    this.setState((prev) => ({ showForm: !prev.showForm }));
  };

  handleSearchResult(searchData) {
     if (!searchData) {
      this.setState({ isSearching: false }, () => this.fetchArtists());
      return;
    }
    this.setState({
      isSearching: true,
      artists: searchData
    });
  }

  render() {
    const { artists } = this.state;
    return (
      <div className="artists">
        <div className="container">
          <div className="artists__header">
            <h2 className="title">Artists</h2>
            <div
              className="artists__header-button"
              onClick={this.handleAddForm}
            >
              <IoIosAddCircleOutline className="add--icon" />
            </div>
            <SearchArtist onSearchResult={this.handleSearchResult} />
          </div>
          <ArtistCreate showForm={this.state.showForm} />
          <div className="artists__content">
            {(Array.isArray(artists) ? artists : []).map((artist) => (
              <ArtistCard
                key={artist.id}
                id={artist.id}
                image_url={artist.image_url}
                nickname={artist.nickname}
                name={artist.name}
              />
            ))}
          </div>
          {!this.state.isSearching && (
            <div className="artists__pagination">
              {this.getPageNumbers().map((page, index) =>
                page === "..." ? (
                  <span key={index} className="artists__pagination-dots">
                    ...
                  </span>
                ) : (
                  <button
                    key={index}
                    className={`artists__pagination-btn ${this.state.currentPage === page ? "artists__pagination-btn--active" : ""}`}
                    onClick={() => this.handlePageChange(page)}
                  >
                    {page}
                  </button>
                ),
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Artists;
