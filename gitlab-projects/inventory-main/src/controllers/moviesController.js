import Movie from "../models/Movie.js";
import { Op } from "sequelize";

const fetchWithRetry = async (fetchFunction, retries, timeout) => {
  for (let i = 0; i < retries; i++) {
    try {
      const result = await Promise.race([
        fetchFunction(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Timeout")), timeout)
        ),
      ]);
      return result;
    } catch (error) {
      if (i === retries - 1) throw error;
      console.log(`Retry ${i + 1} failed: ${error.message}`);
    }
  }
};

export const getAllMovies = async (req, res) => {
  try {
    console.log("getAllMovies called with query:", req.query);
    const { title } = req.query;
    let whereClause = {};

    if (title) {
      whereClause = {
        title: {
          [Op.iLike]: `%${title}%`,
        },
      };
      console.log("getAllMovies whereClause:", whereClause);
    }

    const fetchMovies = async () => {
      return await Movie.findAll({ where: whereClause });
    };

    const movies = await fetchWithRetry(fetchMovies, 1000, 1000); // 1000 retries with 1-second timeout
    console.log("getAllMovies fetched movies:", movies);
    res.json(movies);
  } catch (error) {
    console.error("Error fetching movies:", error);
    res.status(500).json({ error: `Error fetching movies: ${error.message}` });
  }
};

export const createMovie = async (req, res) => {
  try {
    console.log("createMovie called with body:", req.body);
    const { title, description } = req.body;

    const newMovie = await Movie.create({
      title,
      description,
    });

    console.log("createMovie created new movie:", newMovie);
    res.status(201).json(newMovie);
  } catch (error) {
    console.error("Error creating movie:", error);
    res.status(500).json({ error: `Error creating movie: ${error}` });
  }
};

export const deleteAllMovies = async (_req, res) => {
  try {
    console.log("deleteAllMovies called");
    const result = await Movie.destroy({ truncate: true });
    console.log("deleteAllMovies result:", result);
    if (result !== 0) {
      res.status(200).json({ message: `Movies were not deleted.` });
    } else {
      res.status(200).json({ message: `All movies deleted.` });
    }
  } catch (error) {
    console.error("Error deleting movies:", error);
    res.status(500).json({ error: `Error deleting movies: ${error}` });
  }
};

export const getMovieById = async (req, res) => {
  try {
    console.log("getMovieById called with params:", req.params);
    const { id } = req.params;

    const fetchMovie = () => Movie.findByPk(id);

    const movie = await fetchWithRetry(fetchMovie, 1000, 100);
    console.log("getMovieById found movie:", movie);

    if (!movie) {
      return res.status(404).json({ error: "Movie not found" });
    }

    res.status(200).json(movie);
  } catch (error) {
    console.error("Error getting movie:", error);
    res.status(500).json({ error: `Error getting movie: ${error}` });
  }
};

export const updateMovieById = async (req, res) => {
  try {
    console.log(
      "updateMovieById called with params:",
      req.params,
      "and body:",
      req.body
    );
    const { id } = req.params;
    const { title, description } = req.body;

    const [updated] = await Movie.update(
      { title, description },
      { where: { id } }
    );

    console.log("updateMovieById update result:", updated);
    if (updated === 0) {
      return res.status(404).json({ error: "Movie not found" });
    }

    res.status(200).json({ message: "Movie updated successfully" });
  } catch (error) {
    console.error("Error updating movie:", error);
    res.status(500).json({ error: `Error updating movie: ${error}` });
  }
};

export const deleteMovieById = async (req, res) => {
  try {
    console.log("deleteMovieById called with params:", req.params);
    const { id } = req.params;

    const deleted = await Movie.destroy({
      where: { id },
    });

    console.log("deleteMovieById delete result:", deleted);
    if (deleted === 0) {
      return res.status(404).json({ error: "Movie not found" });
    }

    res.status(200).json({ message: "Movie deleted successfully" });
  } catch (error) {
    console.error("Error deleting movie:", error);
    res.status(500).json({ error: `Error deleting movie: ${error}` });
  }
};
