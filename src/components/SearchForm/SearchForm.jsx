import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import "./SearchForm.css";
import { API_CALL_MODE, getUrl } from "../../api/api";
import {
  setApiUrl,
  setQuery,
  setSelectedGenreList,
} from "../../store/slices/movieSlice";

const SearchForm = () => {
  const { query } = useSelector((state) => state.movie);
  const dispatch = useDispatch();

  const handleKeyPress = (e) => {
    if (e.keyCode === 13) {
      let url;
      if (e.target.value !== "") {
        url = getUrl(API_CALL_MODE.SEARCH, e.target.value);
      } else {
        url = getUrl();
      }
      dispatch(setSelectedGenreList({ selectedGenreList: [] }));
      dispatch(setApiUrl({ url }));
    }
  };

  const handleQueryChange = (q) => {
    dispatch(setQuery({ query: q }));
  };

  const handleSearch = () => {
    dispatch(setSelectedGenreList({ selectedGenreList: [] }));
    dispatch(setApiUrl({ url: getUrl(API_CALL_MODE.SEARCH, query) }));
  };

  return (
    <div className="search-form flex items-center">
      <TextField
        aria-label="Search Input Form"
        id="outlined-start-adornment"
        onKeyDown={(e) => handleKeyPress(e)}
        onChange={(e) => handleQueryChange(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        value={query}
        size="small"
      />
      <Button
        aria-label="Search"
        className="w-36 h-10"
        disabled={!query || query.length === 0}
        variant="contained"
        onClick={() => handleSearch()}
      >
        Search
      </Button>
    </div>
  );
};

export default SearchForm;
