import request from "supertest";
import express from "express";
import { getAllMovies } from "./controllers/moviesController.js";
import Movie from "./models/Movie.js";

jest.mock("./models/Movie.js"); // Mock the Movie model

const app = express();
app.use(express.json());
app.get("/movies", getAllMovies);

beforeAll(() => {
  jest.spyOn(console, "log").mockImplementation(() => {}); // Suppress console.log
});

afterAll((done) => {
  jest.restoreAllMocks(); // Restore original console.log
  setTimeout(() => done(), 1000); // 3 second delay
});

describe("GET /movies", () => {
  it("should return a list of movies", async () => {
    const movies = [
      { id: 1, title: "Inception", description: "A mind-bending thriller" },
      { id: 2, title: "Interstellar", description: "A space epic" },
    ];

    Movie.findAll.mockResolvedValue(movies); // Mock the findAll method

    const response = await request(app).get("/movies");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(movies);
  });

  it("should handle errors", async () => {
    const errorMessage = "Error fetching movies";
    Movie.findAll = jest.fn().mockRejectedValue(new Error(errorMessage));

    const response = await request(app).get("/movies");

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: `Error fetching movies: ${errorMessage}`,
    });
  });
});
