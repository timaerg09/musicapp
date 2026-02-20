import React from "react";
import ArtistCreate from "../components/create_artist";
import { IoIosAddCircleOutline } from "react-icons/io";
import ArtistCard from "../components/artist_card";
import SearchArtist from "../components/search_artist";

class Artists extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      artists: [],
      showForm: false,
    };
    this.handleSearchResult = this.handleSearchResult.bind(this);
  }

  componentDidMount() {
    fetch("http://localhost:8000/artists/artists-pagination/")
      .then((res) => res.json())
      .then((data) => {
        this.setState({ artists: data });
      });
  }

  handleAddForm = (e) => {
    this.setState((prev) => ({ showForm: !prev.showForm }));
  };

  handleSearchResult(searchData) {
    this.setState({ artists: searchData });
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
                image_url={artist.image_url}
                nickname={artist.nickname}
                name={artist.name}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default Artists;
