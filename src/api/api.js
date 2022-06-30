export const API_CALL_MODE = {
  SEARCH: "search",
  GENRE_LIST: "genreList",
  GENRE: "genre",
  REQ_TOKEN: "requestToken",
  SESSION_ID: "sessionId",
  FAVOR_LIST: "favoriteList",
  FAVORITE: "favorite",
};

const api_key = process.env.REACT_APP_TMDB_KEY;
const account_id = process.env.REACT_APP_TMDB_ACCOUNT_ID;

export const getUrl = (mode, value) => {
  switch (mode) {
    case API_CALL_MODE.SEARCH:
      return `/search/movie?api_key=${api_key}&query=${value}`;
    case API_CALL_MODE.GENRE_LIST:
      return `/genre/movie/list?api_key=${api_key}`;
    case API_CALL_MODE.GENRE:
      return `/discover/movie?api_key=${api_key}&with_genres=${value}`;
    case API_CALL_MODE.REQ_TOKEN:
      return `/authentication/token/new?api_key=${api_key}`;
    case API_CALL_MODE.SESSION_ID:
      return `/authentication/session/new?api_key=${api_key}`;
    case API_CALL_MODE.FAVOR_LIST:
      return `/account/${account_id}/favorite/movies?api_key=${api_key}&session_id=${value}`;
    case API_CALL_MODE.FAVORITE:
      return `/account/${account_id}/favorite?api_key=${api_key}&session_id=${value}`;
    default:
      return `/movie/now_playing?api_key=${api_key}`;
  }
};
