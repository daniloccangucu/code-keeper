import Order from "../models/order.js";

export const createOrder = async (orderFromPost) => {
  try {
    console.log("Creating order with data:", orderFromPost);
    const { user_id, number_of_items, total_amount } = orderFromPost;
    const newOrder = await Order.create({
      user_id,
      number_of_items,
      total_amount,
    });
    console.log("Order created successfully:", newOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    throw error; // Ensure error is thrown so the retry logic can handle it
  }
};
