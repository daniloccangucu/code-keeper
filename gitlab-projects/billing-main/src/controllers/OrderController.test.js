// tests/orderController.test.js
import { createOrder } from "../controllers/OrderController.js";
import Order from "../models/order.js";

// Mocking Order model
jest.mock("../models/order");

describe("OrderController Integration Test", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock data before each test
  });

  it("should create a new order", async () => {
    const orderData = {
      user_id: "12345",
      number_of_items: 3,
      total_amount: 100.5,
    };

    Order.create.mockResolvedValue(orderData); // Mock the create method

    await createOrder(orderData);

    expect(Order.create).toHaveBeenCalledWith(orderData);
  });

  it("should handle errors when creating a new order", async () => {
    const orderData = {
      user_id: "12345",
      number_of_items: 3,
      total_amount: 100.5,
    };

    Order.create.mockRejectedValue(new Error("Database error")); // Mock an error

    await expect(createOrder(orderData)).rejects.toThrow("Database error");
  });
});
