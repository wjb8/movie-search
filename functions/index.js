const functions = require("firebase-functions");
const app = require("express")();
const {
  getAllMovies,
  postMovie,
  deleteMovie,
  editMovie
} = require("./APIs/movies");

app.get("/movies", getAllMovies);
app.post("/movie", postMovie);
app.delete("/movie/:movieId", deleteMovie);
app.put("/movie/:movieId", editMovie);

exports.api = functions.https.onRequest(app);
