import { createMovie } from "./moviesController.js";
import Movie from "../models/Movie.js";

jest.mock("../models/Movie.js"); // Mock the Movie model

beforeAll(() => {
  jest.spyOn(console, "log").mockImplementation(() => {}); // Suppress console.log
});

afterAll((done) => {
  jest.restoreAllMocks(); // Restore original console.log
  setTimeout(() => done(), 1000); // 3 second delay
});

describe("createMovie", () => {
  it("should create a new movie and return it with status 201", async () => {
    const req = {
      body: {
        title: "Inception",
        description: "A mind-bending thriller",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const newMovie = {
      id: 1,
      title: "Inception",
      description: "A mind-bending thriller",
    };
    Movie.create.mockResolvedValue(newMovie);

    await createMovie(req, res);

    expect(Movie.create).toHaveBeenCalledWith({
      title: "Inception",
      description: "A mind-bending thriller",
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(newMovie);
  });

  it("should handle errors", async () => {
    const req = {
      body: {
        title: "Inception",
        description: "A mind-bending thriller",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const errorMessage = "Error creating movie";
    Movie.create.mockRejectedValue(new Error(errorMessage));

    await createMovie(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: `Error creating movie: Error: ${errorMessage}`,
    });
  });
});
