import express from "express";

import {
  getAllMovies,
  createMovie,
  deleteAllMovies,
  getMovieById,
  updateMovieById,
  deleteMovieById,
} from "../controllers/moviesController.js";

const router = express.Router();

console.log("Setting up routes for movies...");

router.get(
  "/",
  (req, res, next) => {
    console.log("Received GET request for all movies");
    next();
  },
  getAllMovies
);

router.post(
  "/",
  (req, res, next) => {
    console.log("Received POST request to create a movie with body:", req.body);
    next();
  },
  createMovie
);

router.delete(
  "/",
  (req, res, next) => {
    console.log("Received DELETE request to delete all movies");
    next();
  },
  deleteAllMovies
);

router.get(
  "/:id",
  (req, res, next) => {
    console.log(`Received GET request for movie with ID: ${req.params.id}`);
    next();
  },
  getMovieById
);

router.put(
  "/:id",
  (req, res, next) => {
    console.log(
      `Received PUT request to update movie with ID: ${req.params.id} and body:`,
      req.body
    );
    next();
  },
  updateMovieById
);

router.delete(
  "/:id",
  (req, res, next) => {
    console.log(`Received DELETE request for movie with ID: ${req.params.id}`);
    next();
  },
  deleteMovieById
);

console.log("Routes for movies set up.");

export default router;
