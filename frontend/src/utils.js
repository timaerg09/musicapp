export function getArtistsNicknames(album_id, artists_of_albums) {

  if (!artists_of_albums[album_id]) return "";

  return artists_of_albums[album_id].map((item) => item.nickname).join(", ");
}
