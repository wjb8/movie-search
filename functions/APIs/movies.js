const { db } = require("../util/admin");

exports.getAllMovies = (req, res) => {
  db.collection("movies")
    .orderBy("createdAt", "desc")
    .get()
    .then((data) => {
      let movies = [];
      data.forEach((doc) => {
        movies.push({
          movieId: doc.id,
          title: doc.data().title,
          year: doc.data().year,
          rating: doc.data().rating,
          description: doc.data().description,
          createdAt: doc.data().createdAt
        });
      });
      return res.json(movies);
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

exports.postMovie = (req, res) => {
  if (req.body.title.trim() === "") {
    return res.status(400).json({ body: "Must not be empty" });
  }
  if (req.body.year === "") {
    return res.status(400).json({ body: "Must not be empty" });
  }
  if (req.body.rating === "") {
    return res.status(400).json({ body: "Must not be empty" });
  }
  if (req.body.description.trim() === "") {
    return res.status(400).json({ body: "Must not be empty" });
  }

  const newMovie = {
    title: req.body.title,
    year: req.body.year,
    rating: req.body.rating,
    description: req.body.description,
    createdAt: new Date().toISOString()
  };
  db.collection("movies")
    .add(newMovie)
    .then((doc) => {
      const resMovie = newMovie;
      resMovie.id = doc.id;
      return res.json(resMovie);
    });
};

exports.deleteMovie = (req, res) => {
  const document = db.doc(`/movies/${req.params.movieId}`);
  document
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Movie not found" });
      }
      return document.delete();
    })
    .then(() => {
      res.json({ message: "Delete successful" });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

exports.editMovie = (req, res) => {
  if (req.body.movieId || req.body.createdAt) {
    res.status(403).json({ message: "Not allowed to edit" });
  }
  let document = db.collection("movies").doc(`${req.params.movieId}`);
  document
    .update(req.body)
    .then(() => {
      res.json({ message: "Updated successfully" });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({
        error: err.code
      });
    });
};
