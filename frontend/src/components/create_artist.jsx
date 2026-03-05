import React from "react";
import API_URL from "../config";
// форма для создания артиста
class CreateArtist extends React.Component {
  state = {
    name: "",
    nickname: "",
    image_url: "",
    birthday: "",
  };
// обработчик изменения значений полей формы
  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
// обработчик создания артиста
  handleSumbit = (e) => {
    e.preventDefault();
    const { name, nickname, image_url, birthday } = this.state;
    fetch(`${API_URL}/artists/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, nickname, image_url, birthday }),
    })
    .then(()=>{window.location.reload();});
    this.setState({ name: "", nickname: "", image_url: "", birthday: "" });
  };

  render() {
    const { showForm } = this.props;
    return (
      <div className={`create-artist `}>
        <form
          className={`create-artist__form   ${showForm ? "create-artist__form--active" : ""}`}
          onSubmit={this.handleSumbit} autoComplete="off"
        >
          <div className="create-artist__form-item">
            <label htmlFor="name">Name</label>
            <input
              name="name"
              value={this.state.name}
              onChange={this.handleChange}
            />
          </div>
          <div className="create-artist__form-item">
            <label htmlFor="nickname">Nickname</label>
            <input
              name="nickname"
              value={this.state.nickname}
              onChange={this.handleChange}
            />
          </div>
          <div className="create-artist__form-item">
            <label htmlFor="image_url">Image</label>
            <input
              name="image_url"
              value={this.state.image_url}
              onChange={this.handleChange}
            />
          </div>
          <div className="create-artist__form-item">
            <label htmlFor="birthday">Birthday</label>
            <input
              name="birthday"
              type="date"
              value={this.state.birthday}
              onChange={this.handleChange}
            />
          </div>
          <button type="submit">Add artist</button>
        </form>
      </div>
    );
  }
}

export default CreateArtist;
