import React from "react";
import AlbumCreate from "../components/create_album";
import { IoIosAddCircleOutline } from "react-icons/io";
import AlbumCard from "../components/album_card";
import {getArtistsNicknames} from "../utils";

class Albums extends React.Component {
  state = {
    albums: [],
    album_ids:[],
    artists_of_albums:[],
    showForm: false,
  };

  componentDidMount() {
    fetch("http://localhost:8000/albums/albums-pagination/")
      .then((res) => res.json())
      .then((data) => {
        const album_ids = data.map((album) => album.id);
        this.setState({ albums: data, album_ids: album_ids });

        const params = new URLSearchParams();
        album_ids.forEach((id) => params.append("album_ids", id));

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
  }

  handleAddForm = (e) => {
    this.setState((prev) => ({ showForm: !prev.showForm }));
  };

  render() {
    const { albums, artists_of_albums} = this.state;
    return (
      <div className="albums">
        <div className="container">
          <div className="albums__header">
            <h2 className="title">Albums</h2>
            <div className="albums__header-button" onClick={this.handleAddForm}>
              <IoIosAddCircleOutline className="add--icon" />
            </div>
          </div>
          <AlbumCreate showForm={this.state.showForm}/>
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
        </div>
      </div>
    );
  }
}

export default Albums;
