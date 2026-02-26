import React from "react";
// import AlbumCreate from "../components/create_album";
// import { IoIosAddCircleOutline } from "react-icons/io";
import AlbumCard from "../components/album_card";
import { getArtistsNicknames } from "../utils";
import SearchAlbum from "../components/search_album";

class Albums extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      albums: [],
      album_ids: [],
      artists_of_albums: [],
      showForm: false,
      currentPage: 1,
      totalPages: 0,
      limit: 8,
      isSearching: false,
    };
    this.handleSearchResult = this.handleSearchResult.bind(this);
  }
  fetchAlbums = () => {
    const skip = (this.state.currentPage - 1) * this.state.limit;
    fetch(
      `http://localhost:8000/albums/albums-pagination/?skip=${skip}&limit=${this.state.limit}`,
    )
      .then((res) => res.json())
      .then((data) => {
        const album_ids = data.map((album) => album.id);
        this.setState({ albums: data, album_ids: album_ids });

        const params = new URLSearchParams();
        album_ids.forEach((id) => params.append("album_ids", id));
        if (album_ids.length === 0) return;
        fetch(
          `http://localhost:8000/artist-album/get/artists/by-albums?${params}`,
        )
          .then((res) => res.json())
          .then((artistsData) => {
            const artists_map = {};
            artistsData.forEach((item) => {
              artists_map[item.album_id] = item.artists;
            });
            this.setState({ artists_of_albums: artists_map });
          });
      });
  };
  componentDidMount() {
    fetch("http://localhost:8000/albums/get/count")
      .then((res) => res.json())
      .then((data) => {
        this.setState({ totalPages: Math.ceil(data / this.state.limit) });
      });
    this.fetchAlbums();
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
      this.fetchAlbums();
    });
  };
  handleAddForm = (e) => {
    this.setState((prev) => ({ showForm: !prev.showForm }));
  };

  handleSearchResult(searchData) {
    if (!searchData) {
      this.setState({ isSearching: false }, () => this.fetchAlbums());
      return;
    }
    const album_ids = searchData.map((album) => album.id);
    this.setState({
      isSearching: true,
      albums: searchData,
      album_ids: album_ids,
    });
  }

  render() {
    const { albums, artists_of_albums } = this.state;
    return (
      <div className="albums">
        <div className="container">
          <div className="albums__header">
            <h2 className="title">Albums</h2>
            {/* <div className="albums__header-button" onClick={this.handleAddForm}>
                <IoIosAddCircleOutline className="add--icon" />
              </div> */}
            <SearchAlbum onSearchResult={this.handleSearchResult} />
          </div>
          {/* <AlbumCreate showForm={this.state.showForm}/> */}

          <div className="albums__content">
            {(Array.isArray(albums) ? albums : []).map((album) => (
              <AlbumCard
                key={album.id}
                cover_url={album.cover_url}
                title={album.title}
                year={album.year}
                artists={getArtistsNicknames(album.id, artists_of_albums)}
              />
            ))}
          </div>
          {!this.state.isSearching && (
            <div className="albums__pagination">
              {this.getPageNumbers().map((page, index) =>
                page === "..." ? (
                  <span key={index} className="albums__pagination-dots">
                    ...
                  </span>
                ) : (
                  <button
                    key={index}
                    className={`albums__pagination-btn ${this.state.currentPage === page ? "albums__pagination-btn--active" : ""}`}
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

export default Albums;
