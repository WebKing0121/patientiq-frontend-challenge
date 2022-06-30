import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_CALL_MODE, getUrl } from "../../api/api";
import axios from "../../api/axios";

const initialState = {
  expireAt: "",
  requestToken: "",
  sessionId: "",
};

export const getSessionId = createAsyncThunk(
  "createSessionID",
  async ({ requestToken }) => {
    let token = requestToken;
    if (!token) token = localStorage.getItem("tmdb_request_token");
    const res = await axios.post(getUrl(API_CALL_MODE.SESSION_ID), {
      request_token: token,
    });
    if (res.data.success) {
      return { sessionId: res.data.session_id, requestToken };
    }
  }
);

export const getRequestToken = createAsyncThunk("getRequestToken", async () => {
  localStorage.removeItem("tmdb_session_id");
  const res = await axios.get(getUrl(API_CALL_MODE.REQ_TOKEN));
  if (res.data.success) {
    localStorage.setItem("tmdb_expires_at", res.data.expires_at);
    return {
      requestToken: res.data.request_token,
      expireAt: res.data.expires_at,
    };
  }
});

export const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    initAccount: (state) => {
      state.expireAt = localStorage.getItem("tmdb_expires_at");
      state.requestToken = localStorage.getItem("tmdb_request_token");
      state.sessionId = localStorage.getItem("tmdb_session_id");
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getSessionId.fulfilled, (state, action) => {
      state.sessionId = action.payload.sessionId;
      localStorage.setItem("tmdb_session_id", action.payload.sessionId);
      state.requestToken = action.payload.requestToken;
      localStorage.setItem("tmdb_request_token", action.payload.requestToken);
    });
    builder.addCase(getRequestToken.fulfilled, (state, action) => {
      state.requestToken = action.payload.requestToken;
      state.expireAt = action.payload.expireAt;
      window.location.replace(
        `https://www.themoviedb.org/authenticate/${action.payload.requestToken}?redirect_to=${window.location.href}`
      );
    });
  },
});

export const { initAccount } = authSlice.actions;
export default authSlice.reducer;
