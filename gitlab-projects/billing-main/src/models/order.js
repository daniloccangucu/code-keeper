import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

console.log("Defining the Order model");

const Order = sequelize.define(
  "Order",
  {
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    number_of_items: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    total_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    tableName: "orders",
    timestamps: false,
  }
);

console.log("Order model defined successfully");

export default Order;
