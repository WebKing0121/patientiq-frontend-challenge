import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_CALL_MODE, getUrl } from "../../api/api";
import axios from "../../api/axios";

const initialState = {
  loading: false,
  favoriteMovieList: [],
  movieList: [],
  query: "",
  page: 1,
  total: 0,
  genreList: [],
  selectedGenreList: [],
  apiUrl: getUrl(),
};

export const getMovieList = createAsyncThunk(
  "getMovieList",
  async ({ url, page = 1 }) => {
    const res = await axios.get(
      `${url}&page=${page}&language=en-US&include_adult=false&sort_by=vote_average.desc`
    );
    return { data: res.data, page, url };
  }
);

export const getFavoriteMovieList = createAsyncThunk(
  "getFavoriteMovieList",
  async (sessionId) => {
    let ssId = sessionId;
    if (!ssId) ssId = localStorage.getItem("tmdb_session_id");
    const res = await axios.get(getUrl(API_CALL_MODE.FAVOR_LIST, ssId));
    return { favoriteMovieList: res.data.results };
  }
);

export const getGenreList = createAsyncThunk("getGenreList", async () => {
  const res = await axios.get(getUrl(API_CALL_MODE.GENRE_LIST));
  return { genreList: res.data.genres };
});

export const markAsFavorite = createAsyncThunk(
  "markAsFavorite",
  async ({ movieId, sessionId, favorite }) => {
    console.log("tiger: ", favorite);
    const res = await axios.post(getUrl(API_CALL_MODE.FAVORITE, sessionId), {
      media_type: "movie",
      media_id: movieId,
      favorite,
    });
    return { favorite, movieId, success: res.data.success };
  }
);

export const movieSlice = createSlice({
  name: "movieSlice",
  initialState,
  reducers: {
    setQuery: (state, action) => {
      state.query = action.payload.query;
    },
    nextPage: (state) => {
      state.page++;
    },
    setSelectedGenreList: (state, action) => {
      state.selectedGenreList = action.payload.selectedGenreList;
    },
    setApiUrl: (state, action) => {
      state.apiUrl = action.payload.url;
    },
  },
  extraReducers: (builder) => {
    // Get movie list
    builder.addCase(getMovieList.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getMovieList.fulfilled, (state, action) => {
      state.loading = false;
      const { url, page, data } = action.payload;
      state.apiUrl = url;
      state.page = page;
      state.total = data.total_results;
      if (state.movieList.length === 0 || page === 1) {
        state.movieList = data.results;
      } else if (data.results.length > 0) {
        state.movieList = [...state.movieList, ...data.results];
      }
    });
    builder.addCase(getMovieList.rejected, (state) => {
      state.loading = false;
      state.error = "Failed to get movie list";
    });
    // Get favorite movie list
    builder.addCase(getFavoriteMovieList.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getFavoriteMovieList.fulfilled, (state, action) => {
      state.loading = false;
      state.favoriteMovieList = action.payload.favoriteMovieList;
    });
    builder.addCase(getFavoriteMovieList.rejected, (state) => {
      state.loading = false;
      state.error = "Failed to get favorite movie list";
    });
    // Get genre list
    builder.addCase(getGenreList.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getGenreList.fulfilled, (state, action) => {
      state.loading = false;
      state.genreList = action.payload.genreList;
    });
    builder.addCase(getGenreList.rejected, (state) => {
      state.loading = false;
      state.error = "Failed to get genre list";
    });
    // Mark as a favorite
    builder.addCase(markAsFavorite.fulfilled, (state, action) => {
      state.loading = false;
      const { favorite, movieId, success } = action.payload;
      if (success) {
        let favoriteMovieList = [...state.favoriteMovieList];
        if (favorite) {
          if (favoriteMovieList && favoriteMovieList.length > 0)
            favoriteMovieList.push(
              state.movieList.find((m) => m.id === movieId)
            );
          else
            favoriteMovieList = [state.movieList.find((m) => m.id === movieId)];
        } else
          favoriteMovieList = favoriteMovieList.filter((m) => m.id !== movieId);
        state.favoriteMovieList = favoriteMovieList;
      }
    });
    builder.addCase(markAsFavorite.rejected, (state) => {
      state.error = "Failed to mark as favorite movie";
    });
  },
});

export const { setQuery, nextPage, setSelectedGenreList, setApiUrl } =
  movieSlice.actions;
export default movieSlice.reducer;
