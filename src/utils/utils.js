export const isExpired = (d) => {
  let date = d;
  const now = new Date().getTime();
  if (date === "") date = localStorage.getItem("tmdb_expires_at");
  return now > new Date(date).getTime();
};

export const getYear = (date) => {
  if (date) {
    const dateArr = date.split("-");
    if (dateArr && dateArr.length > 0) return dateArr[0];
  }
  return "";
};
