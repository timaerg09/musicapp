import React from "react";
import ArtistCard from "../components/artist_card";
import AlbumCard from "../components/album_card";
import { getArtistsNicknames } from "../utils";
import API_URL from "../config";

class Home extends React.Component {
  state = {
    artists: [],
    albums: [],
    album_ids: [],
    artists_of_albums: {},
  };

  componentDidMount() {
    fetch(`${API_URL}/artists/random`)
      .then((res) => res.json())
      .then((data) => {
        this.setState({ artists: data });
      });

    fetch(`${API_URL}/albums/random`)
      .then((res) => res.json())
      .then((data) => {
        const album_ids = data.map((album) => album.id);
        this.setState({ albums: data, album_ids: album_ids });

        const params = new URLSearchParams();
        album_ids.forEach((id) => params.append("album_ids", id));

        fetch(
          `${API_URL}/artist-album/get/artists/by-albums?${params}`,
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
  }


  render() {
    const { artists, albums, artists_of_albums} = this.state;

    return (
      <div className="home">
        <div className="container">
          <h2 className="title home__title">Home</h2>
          <div className="home__content">
            <div className="home__subtitle">Artists</div>
            <div className="home__artists">
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
            <div className="home__subtitle">Albums</div>
            <div className="home__albums">
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
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
