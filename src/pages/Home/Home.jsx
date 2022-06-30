import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import GenreFilterForm from "../../components/GenreFilterForm";
import SearchForm from "../../components/SearchForm/SearchForm";
import SearchResult from "../../components/SearchResult";
import {
  getRequestToken,
  getSessionId,
  initAccount,
} from "../../store/slices/";
import { getFavoriteMovieList, getMovieList } from "../../store/slices/";
import { isExpired } from "../../utils/utils";
import styles from "./Home.module.css";

const Home = () => {
  const { expireAt, requestToken, sessionId } = useSelector(
    (state) => state.account
  );
  const { apiUrl } = useSelector((state) => state.movie);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getMovieList({ url: apiUrl }));
  }, [apiUrl, dispatch]);

  useEffect(() => {
    if (!sessionId) dispatch(initAccount());
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("request_token");
    const approved = urlParams.get("approved");
    if (token && approved) {
      dispatch(getSessionId({ requestToken: token }));
      navigate("/");
    } else {
      let reqToken = requestToken
        ? requestToken
        : localStorage.getItem("tmdb_request_token");
      let ssId = sessionId
        ? sessionId
        : localStorage.getItem("tmdb_session_id");
      if (isExpired(expireAt) || !reqToken) dispatch(getRequestToken());
      if (!ssId) dispatch(getSessionId({ requestToken }));
    }
  }, []);

  useEffect(() => {
    if (sessionId) dispatch(getFavoriteMovieList(sessionId));
  }, [dispatch, sessionId]);

  return (
    <div className="w-4/5 py-10 mx-auto">
      <p
        className={`${styles["title"]} text-3xl uppercase text-center font-bold`}
      >
        acme theaters
      </p>
      <div className="mt-10">
        <SearchForm />
      </div>
      <div className="mt-4">
        <GenreFilterForm />
      </div>
      <div className="mt-6">
        <SearchResult />
      </div>
    </div>
  );
};

export default Home;
