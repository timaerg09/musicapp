import React from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import AlbumCard from "../components/album_card";
import { useParams } from "react-router-dom";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import AlbumCreate from "../components/create_album";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import API_URL from "../config";

class ArtistPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      artist: null,
      albums: [],
      showForm: false,
      editMode: false,
      editData: {
        nickname: "",
        name: "",
        birthday: "",
        image_url: "",
      },
      editAlbumId: null,
      editAlbumData: {
        title: "",
        year: "",
        cover_url: "",
      },
      showConfirmDelete: false,
    };
  }
  currentAge = (birthday) => {
  const birth = new Date(birthday);
  const today = new Date();

  let age = today.getFullYear() - birth.getFullYear();

  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
};
  birthdayFormatter = (birthday) => {
    if (!birthday) return "";
    const [year, month, day] = birthday.split("-");
    const months = {
      "01": "янв.",
      "02": "фев.",
      "03": "мар.",
      "04": "апр.",
      "05": "май",
      "06": "июн.",
      "07": "июл.",
      "08": "авг.",
      "09": "сен.",
      10: "окт.",
      11: "ноя.",
      12: "дек.",
    };
    return `${day} ${months[month]} ${year}`;
  };
  componentDidMount() {
    fetch(`${API_URL}/artists/get/id/${this.props.id}`)
      .then((res) => res.json())
      .then((data) => {
        this.setState({ artist: data });
        fetch(
          `${API_URL}/artist-album/get/albums/by-artist?artist_id=${this.props.id}`,
        )
          .then((res) => res.json())
          .then((data1) => {
            this.setState({ albums: data1 });
          });
      });
  }
  handleAddForm = (e) => {
    this.setState((prev) => ({ showForm: !prev.showForm }));
  };
  handleDeleteAlbum = (album_id) => {
    fetch(
      `${API_URL}/artist-album/get/artists/by-albums?album_ids=${album_id}`,
    )
      .then((res) => res.json())
      .then((data) => {
        const artists = data[0].artists;
        if (artists.length === 1) {
          fetch(`${API_URL}/albums/delete/${album_id}`, {
            method: "DELETE",
          }).then(() => this.refreshAlbums());
        } else {
          fetch(
            `${API_URL}/artist-album/delete/connection?artist_id=${this.props.id}&album_id=${album_id}`,
            {
              method: "DELETE",
            },
          ).then(() => setTimeout(() => this.refreshAlbums(), 300));
        }
      });
  };
  handleEditAlbum = (album_id) => {
    const album = this.state.albums.find((a) => a.id === album_id);
    this.setState({
      editAlbumData: {
        ...this.state.editAlbumData,
        title: album.title,
        year: album.year,
        cover_url: album.cover_url,
      },
      editAlbumId: album.id,
    });
  };
  refreshAlbums = () => {
    fetch(
      `${API_URL}/artist-album/get/albums/by-artist?artist_id=${this.props.id}`,
    )
      .then((res) => res.json())
      .then((data) => this.setState({ albums: data }));
  };
  handleEditToggle = () => {
    const { artist } = this.state;
    this.setState((prev) => ({
      editMode: !prev.editMode,
      editData: {
        nickname: artist.nickname,
        name: artist.name,
        birthday: artist.birthday,
        image_url: artist.image_url,
      },
    }));
  };
  handleConfirmDelete = () => {
    fetch(`${API_URL}/artists/delete/${this.props.id}`, {
      method: "DELETE",
    }).then(() => {
      window.history.back();
    });
  };
  handleSaveArtist = (e) => {
    e.preventDefault();
    fetch(`${API_URL}/artists/update/${this.props.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(this.state.editData),
    }).then(() => {
      this.setState({
        editMode: false,
        artist: { ...this.state.artist, ...this.state.editData },
      });
    });
  };
  handleSaveAlbum = (e, album_id) => {
    e.preventDefault();
    fetch(`${API_URL}/albums/update/${album_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(this.state.editAlbumData),
    }).then(() => {
      this.setState({
        editAlbumId: null,
        albums: this.state.albums.map((a) =>
          a.id === album_id ? { ...a, ...this.state.editAlbumData } : a,
        ),
      });
    });
  };
  render() {
    const { albums, artist } = this.state;
    if (!artist) return null;
    return (
      <div className="artist-page">
        <div className="container">
          <div className="artist-page__header">
            <IoArrowBackCircleOutline
              className="back--icon"
              onClick={() => window.history.back()}
            />
            <img
              src={artist.image_url}
              alt={artist.nickname}
              className="artist-page__header-img"
            />
            {this.state.editMode ? (
              <div className="artist-page__header-info">
                <form
                  onSubmit={this.handleSaveArtist}
                  className="artist-page__header-form"
                >
                  <input
                    value={this.state.editData.nickname}
                    onChange={(e) =>
                      this.setState({
                        editData: {
                          ...this.state.editData,
                          nickname: e.target.value,
                        },
                      })
                    }
                  />
                  <input
                    value={this.state.editData.name}
                    onChange={(e) =>
                      this.setState({
                        editData: {
                          ...this.state.editData,
                          name: e.target.value,
                        },
                      })
                    }
                  />
                  <input
                    value={this.state.editData.birthday}
                    onChange={(e) =>
                      this.setState({
                        editData: {
                          ...this.state.editData,
                          birthday: e.target.value,
                        },
                      })
                    }
                  />
                  <input
                    value={this.state.editData.image_url}
                    onChange={(e) =>
                      this.setState({
                        editData: {
                          ...this.state.editData,
                          image_url: e.target.value,
                        },
                      })
                    }
                  />
                  <button>Сохранить</button>
                  <button onClick={this.handleEditToggle}>Отмена</button>
                </form>
              </div>
            ) : (
              <div className="artist-page__header-info">
                <h2 className="artist-page__header-nickname">
                  {artist.nickname}
                </h2>

                <CiEdit
                  className="edit-artist--icon"
                  onClick={this.handleEditToggle}
                />
                <MdDelete
                  className="delete-artist--icon"
                  onClick={() => {
                    this.setState({ showConfirmDelete: true });
                  }}
                />
                {this.state.showConfirmDelete && (
                  <div
                    className="artist-page__overlay"
                    onClick={() => this.setState({ showConfirmDelete: false })}
                  />
                )}
                {this.state.showConfirmDelete && (
                  <div className="artist-page__confirm-delete">
                    <p>Удалить артиста?</p>
                    <button
                      className="artist__page-confirm-delete-btn"
                      onClick={this.handleConfirmDelete}
                    >
                      Да
                    </button>
                    <button
                      className="artist__page-confirm-delete-btn"
                      onClick={() =>
                        this.setState({ showConfirmDelete: false })
                      }
                    >
                      Отмена
                    </button>
                  </div>
                )}
                <h4 className="artist-page__header-name">{artist.name}</h4>
                <p className="artist-page__header-birthday">
                  {this.birthdayFormatter(artist?.birthday)} (
                  {this.currentAge(artist?.birthday)} лет)
                </p>
              </div>
            )}
          </div>
          <div className="artist-page__content">
            <div className="artist-page__content-header">
              <p className="artist-page__content-title">Albums</p>
              <div
                className="artist-page__add-button"
                onClick={this.handleAddForm}
              >
                <IoIosAddCircleOutline className="add--icon" />
              </div>
            </div>
            <AlbumCreate showForm={this.state.showForm} />
            <div className="artist-page__content-albums">
              {(Array.isArray(albums) ? albums : []).map((album) =>
                this.state.editAlbumId === album.id ? (
                  <form
                    key={album.id}
                    onSubmit={(e) => this.handleSaveAlbum(e, album.id)}
                    className="album-edit-form"
                  >
                    <input
                      value={this.state.editAlbumData.title}
                      onChange={(e) =>
                        this.setState({
                          editAlbumData: {
                            ...this.state.editAlbumData,
                            title: e.target.value,
                          },
                        })
                      }
                    />
                    <input
                      value={this.state.editAlbumData.year}
                      onChange={(e) =>
                        this.setState({
                          editAlbumData: {
                            ...this.state.editAlbumData,
                            year: e.target.value,
                          },
                        })
                      }
                      type="number"
                      min="1900"
                      max={new Date().getFullYear()}
                    />
                    <input
                      value={this.state.editAlbumData.cover_url}
                      onChange={(e) =>
                        this.setState({
                          editAlbumData: {
                            ...this.state.editAlbumData,
                            cover_url: e.target.value,
                          },
                        })
                      }
                    />
                    <button className="album-edit-form__btn--save">
                      Сохранить
                    </button>
                    <button
                      type="button"
                      onClick={() => this.setState({ editAlbumId: null })}
                      className="album-edit-form__btn--cancel"
                    >
                      Отмена
                    </button>
                  </form>
                ) : (
                  <AlbumCard
                    key={album.id}
                    cover_url={album.cover_url}
                    title={album.title}
                    year={album.year}
                    onDelete={() => this.handleDeleteAlbum(album.id)}
                    onEdit={() => this.handleEditAlbum(album.id)}
                  />
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function ArtistPageWrapper() {
  const { id } = useParams();
  return <ArtistPage id={id} />;
}

export default ArtistPageWrapper;
