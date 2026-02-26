import React from "react";
import API_URL from "../config";

class CreateAlbum extends React.Component {
  state = {
    title: "",
    year: "",
    cover_url: "",
    artist_search: "",
    artist_results: [],
    selected_artists: [],
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleArtistSearch = (e) => {
    const query = e.target.value;
    this.setState({ artist_search: query });
    if (!query) {
      this.setState({ artist_results: [] });
      return;
    }
    fetch(`${API_URL}/artists/get/${query}`)
      .then((res) => res.json())
      .then((data) => this.setState({ artist_results: data }));
  };

  handleSelectArtist = (artist) => {
    const { selected_artists } = this.state;
    if (selected_artists.find((a) => a.id === artist.id)) return;
    this.setState({
      selected_artists: [...selected_artists, artist],
      artist_search: "",
      artist_results: [],
    });
  };

  handleRemoveArtist = (id) => {
    this.setState({
      selected_artists: this.state.selected_artists.filter((a) => a.id !== id),
    });
  };

  handleSumbit = (e) => {
    e.preventDefault();
    const { title, year, cover_url, selected_artists } = this.state;
    if (selected_artists.length === 0) {
      alert("Добавьте хотя бы одного артиста");
      return;
    }
    fetch(`${API_URL}/albums/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, year, cover_url }),
    })
      .then((res) => res.json())
      .then((data) => {
        const params = new URLSearchParams();
        selected_artists.forEach((artist) =>
          params.append("artist_ids", artist.id),
        );
        params.append("album_ids", data.id);
        fetch(`${API_URL}/artist-album/create?${params}`, {
          method: "POST",
        }).then(() => {
          this.setState({
            title: "",
            year: "",
            cover_url: "",
            selected_artists: [],
          }); 
          window.location.reload();
        });
      });
  };

  render() {
    const { showForm } = this.props;
    const { artist_search, artist_results, selected_artists } = this.state;
    return (
      <div className="create-album">
        <form
          className={`create-album__form ${showForm ? "create-album__form--active" : ""}`}
          onSubmit={this.handleSumbit} autoComplete="off"
        >
          <div className="create-album__form-item">
            <label htmlFor="title">Title</label>
            <input
              name="title"
              value={this.state.title}
              onChange={this.handleChange}
            />
          </div>
          <div className="create-album__form-item">
            <label htmlFor="year">Year</label>
            <input
              name="year"
              type="number"
              min="1900"
              max={new Date().getFullYear()}
              value={this.state.year}
              onChange={this.handleChange}
            />
          </div>
          <div className="create-album__form-item">
            <label htmlFor="cover_url">Cover_url</label>
            <input
              name="cover_url"
              value={this.state.cover_url}
              onChange={this.handleChange}
            />
          </div>

          <div className="create-album__form-artists">
            <input
              value={artist_search}
              onChange={this.handleArtistSearch}
              placeholder="Поиск артиста..."
            />
            {artist_results.length > 0 && (
              <div className="create-album__form-artists-results">
                {artist_results.map((artist) => (
                  <div
                    key={artist.id}
                    className="create-album__form-artists-result-item"
                    onClick={() => this.handleSelectArtist(artist)}
                  >
                    {artist.nickname}
                  </div>
                ))}
              </div>
            )}
            <div className="create-album__form-artists-selected">
              {selected_artists.map((artist) => (
                <span
                  key={artist.id}
                  className="create-album__form-artists-tag"
                >
                  {artist.nickname}
                  <button
                    type="button"
                    onClick={() => this.handleRemoveArtist(artist.id)}
                  >
                    x
                  </button>
                </span>
              ))}
            </div>
          </div>

          <button type="submit">Add album</button>
        </form>
      </div>
    );
  }
}

export default CreateAlbum;
