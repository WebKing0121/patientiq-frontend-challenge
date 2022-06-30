import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import IconButton from "@mui/material/IconButton";
import StarIcon from "@mui/icons-material/Star";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import styles from "./MovieCard.module.css";
import { getYear } from "../../utils/utils";
import { markAsFavorite } from "../../store/slices/movieSlice";

const MovieCard = ({ movie }) => {
  const { favoriteMovieList, genreList } = useSelector((state) => state.movie);
  const { sessionId } = useSelector((state) => state.account);
  const [isShow, setIsShow] = useState(false);
  const [isFavor, setIsFavor] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    if (sessionId) setDisabled(false);
  }, [sessionId]);

  useEffect(() => {
    if (favoriteMovieList && favoriteMovieList.length > 0)
      setIsFavor(!!favoriteMovieList.find((m) => m.id === movie.id));
    else setIsFavor(false);
  }, [movie, favoriteMovieList, setIsFavor]);

  const getRating = (rating) => {
    if (rating) return rating.toFixed(1);
    return 0;
  };

  const showDetails = () => {
    if (!isShow) setIsShow(true);
  };

  const handleFavoriteClick = async (e) => {
    e.stopPropagation();
    dispatch(
      markAsFavorite({ movieId: movie.id, sessionId, favorite: !isFavor })
    );
  };

  return (
    <div className="relative" onClick={() => showDetails()}>
      <div className={`${styles["movie-image"]} w-full bg-black relative h-0`}>
        {movie.poster_path && (
          <img
            className="w-full h-full absolute left-0 top-0 object-contain my-auto bg-black"
            src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
            alt={`${movie.title} Poster`}
          />
        )}
      </div>
      <div
        className={`absolute bottom-0 w-full bg-gray-800 transition-all duration-1000 bg-opacity-80 p-4 ${
          isShow ? "h-full overflow-auto" : "h-36 overflow-hidden"
        }`}
      >
        {isShow && (
          <div className="absolute right-0 flex justify-end top-0">
            <IconButton
              aria-label="close"
              size="small"
              style={{ color: "#fff" }}
              onClick={() => setIsShow(false)}
            >
              <CloseIcon />
            </IconButton>
          </div>
        )}
        <div className="flex items-end">
          <p className={`text-2xl text-white ${isShow ? "" : "truncate"}`}>
            {movie.title}
          </p>
          <p className="text-gray-400 ml-2">({getYear(movie.release_date)})</p>
        </div>
        <div className="flex items-center my-2">
          <p className="text-lg font-bold text-white">
            {getRating(movie.vote_average)}
          </p>
          <IconButton
            aria-label="Like Film"
            disabled={disabled}
            onClick={(e) => handleFavoriteClick(e)}
          >
            <StarIcon className="ml-0.5" color={isFavor ? "error" : ""} />
          </IconButton>
        </div>
        <div className="flex flex-wrap -ml-1">
          {movie.genre_ids.map((id) => (
            <div
              className="flex items-center rounded-2xl bg-gray-200 px-4 py-1 text-sm m-1"
              key={id}
            >
              {genreList.find((g) => g.id === id).name}
            </div>
          ))}
        </div>
        <div className="my-4 flow text-white">{movie.overview}</div>
        <div className="mt-4">
          <Button
            aria-label="Buy Tickets"
            variant="outlined"
            className={`w-40 xl:w-52 ${styles["buy-btn"]}`}
          >
            Buy Tickets
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
