import React from "react";
import ArtistCard from "../components/artist_card";
import AlbumCard from "../components/album_card";

class Home extends React.Component {
  state = {
    artists: [],
    albums: [],
  };

  componentDidMount() {
    fetch("http://localhost:8000/artists/random")
      .then((res) => res.json())
      .then((data) => {
        this.setState({ artists: data });
      });
    fetch("http://localhost:8000/albums/random")
      .then((res) => res.json())
      .then((data) => {
        this.setState({ albums: data });
      });
  }
  render() {
    const { artists } = this.state;
    const { albums } = this.state;
    return (
      <div className="home">
        <div className="container">
          <h2 className="title">Home</h2>
          <div className="home__content">
            <div className="home__subtitle">Artists</div>
            <div className="home__artists">
              {(Array.isArray(artists) ? artists : []).map((artist) => (
                <ArtistCard
                  key={artist.id}
                  image_url={artist.image_url}
                  nickname={artist.nickname}
                  name={artist.name}
                />
              ))}
            </div>
            <div className="home__subtitle">Albums</div>
            <div className="home__albums">
              {(Array.isArray(albums) ? albums : []).map((album) => (
                <AlbumCard
                  key={album.id}
                  cover_url={album.cover_url}
                  title={album.title}
                  year={album.year}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
