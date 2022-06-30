import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";
import { getMovieList, nextPage } from "../store/slices/movieSlice";
import MovieCard from "./MovieCard/MovieCard";

const SearchResult = () => {
  const { apiUrl, loading, movieList, total, page } =
    useSelector((state) => state.movie);
  const dispatch = useDispatch()

  const handleNext = () => {
    dispatch(nextPage());
    dispatch(getMovieList({url: apiUrl, page: page + 1}));
  };

  return (
    <div>
      <p className="text-3xl pb-6 border-b-2 border-gray-300">
        Currently Showing {movieList?.length ?? 0} of {total}
      </p>
      {movieList && (
        <div id="scrollableDiv" className="h-screen overflow-auto mt-8">
          <InfiniteScroll
            dataLength={movieList.length} //This is important field to render the next data
            next={() => handleNext()}
            style={{ display: "flex", flexDirection: "column-reverse" }}
            hasMore={true}
            loader={loading && <h4>Loading...</h4>}
            endMessage={
              <p className="text-center">
                <b>Yay! You have seen it all</b>
              </p>
            }
            scrollableTarget="scrollableDiv"
          >
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 lg:gap-4 xl:gap-8">
              {movieList.length > 0 &&
                movieList.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
            </div>
          </InfiniteScroll>
        </div>
      )}
    </div>
  );
};

export default SearchResult;
