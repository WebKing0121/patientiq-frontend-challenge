import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Checkbox from "@mui/material/Checkbox";
import CloseIcon from "@mui/icons-material/Close";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select from "@mui/material/Select";
import { API_CALL_MODE, getUrl } from "../api/api";
import {
  getGenreList,
  setApiUrl,
  setQuery,
  setSelectedGenreList,
} from "../store/slices/movieSlice";

const GenreFilterForm = () => {
  const { genreList, selectedGenreList } = useSelector((state) => state.movie);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getGenreList());
  }, [dispatch]);

  const handleSelectedGenreListChange = (e) => {
    dispatch(setSelectedGenreList({ selectedGenreList: e.target.value }));
    discoverMovie(e.target.value);
  };

  const handleRemoveGenre = (genre) => {
    let tempList = selectedGenreList;
    tempList = tempList.filter((g) => g !== genre);
    dispatch(setSelectedGenreList({ selectedGenreList: tempList }));
    discoverMovie(tempList);
  };

  const discoverMovie = (genres) => {
    setQuery({ query: "" });
    let url;
    if (genres.length > 0) {
      const genreUrl = encodeURI(
        genres
          .map((name) => genreList.find((g) => g.name === name).id)
          .join(",")
      );
      url = getUrl(API_CALL_MODE.GENRE, genreUrl);
    } else url = getUrl();
    dispatch(setApiUrl({ url }));
  };

  return (
    <div className="">
      <FormControl className="w-64" size="small">
        <InputLabel id="demo-multiple-checkbox-label">Genre</InputLabel>
        <Select
          aria-label="Genre Select Form"
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={selectedGenreList}
          onChange={handleSelectedGenreListChange}
          input={<OutlinedInput label="Tag" />}
          renderValue={(selected) => selected.join(", ")}
          size="small"
        >
          {genreList.map((genre) => (
            <MenuItem key={genre.id} value={genre.name}>
              <Checkbox checked={selectedGenreList.indexOf(genre.name) > -1} />
              <ListItemText primary={genre.name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <div className="mt-2 flex flex-wrap">
        {selectedGenreList.map((genre) => (
          <div
            className="flex items-center pl-4 pr-2 mr-2 my-1 border rounded-full"
            key={genre}
          >
            {genre}
            <IconButton onClick={() => handleRemoveGenre(genre)}>
              <CloseIcon />
            </IconButton>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GenreFilterForm;
