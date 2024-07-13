import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

console.log("Defining the Movie model...");

const Movie = sequelize.define(
  "Movie",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    timestamps: false,
    tableName: "movies",
  }
);

console.log("Movie model defined:", Movie === sequelize.models.Movie);

export default Movie;
