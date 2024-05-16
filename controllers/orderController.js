const paystack = require("paystack")(process.env.PAYSTACK_API_SECRET_KEY_TEST);
const { v4: uuidv4 } = require("uuid");
const Order = require("../models/Order");
const { clients } = require("../utils/clients");
const User = require("../models/User");
const Product = require("../models/Product");
const applyCoupon = require("../utils/applyCoupon");
const validateMongoDbId = require("../utils/validateMongoDbId");

// Controller to create orders
const createOrder = async (req, res) => {
  let couponApplied;
  try {
    const { items, paymentIntent, coupon, address } = req.body;
    const userId = req.user._id;

    // Validate input data
    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new Error("Items in the array cannot be empty");
    }

    // Fetch user information
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found!");

    //Get the user's address if already saved in the database. If there is no address associated with the user, It will return 0.
    const userAddressLength = Object.values(user.address).filter(
      (field) => field !== undefined
    ).length;

    if (!userAddressLength && !address)
      throw new Error("An address must be provided!");

    // Calculate subtotal for each item
    const updatedItems = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.product);
        if (!product) {
          throw new Error(
            `Product not found for item with productId ${item.product}`
          );
        }
        const subTotal = parseInt(item.quantity) * parseFloat(product.price);
        return { ...item, subTotal };
      })
    );

    // Calculate total order amount
    let totalAmount = updatedItems.reduce(
      (acc, item) => acc + item.subTotal,
      0
    );

    if (coupon) {
      couponApplied = true;
      const discount = await applyCoupon(coupon, totalAmount);
      totalAmount = totalAmount - discount;
    }

    //Now if the above conditions are met, initialize the transaction using paystack.

    const paymentResponse = await paystack.transaction.initialize({
      email: user.email,
      amount: parseInt(totalAmount) * 100, //When using paystack, amount must be an integar and it is multiplied by 100, because it expects the amount in kobo.
      reference: uuidv4(), //If reference is not provided, an automatic reference is provided. It is with this reference that you would use to verify payment.
      callback_url: process.env.CLIENT_CALLBACK_URL,
      metadata: {
        items: updatedItems,
        paymentIntent,
        orderedBy: userId,
        address: !address ? user.address : address,
        couponApplied,
        coupon,
        totalAmount,
      }, //You pass in this as metadata, so that it would be in the body of the request sent to you by the webhook, so that you can access it easily
    });

    if (!paymentResponse.status) throw new Error("Payment Initiation failed");
    const authorizationUrl = paymentResponse.data.authorization_url;

    //Send the authorization url back to the client, so that he/she can navigate to that and checkout.
    res.status(201).json({
      message: "Order creation attempted. Payment Initiation successful",
      authorizationUrl,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(400).json({ error: error.message });
  }
};

const verifyPayment = async (req, res) => {
  //note that we are using webhooks here. I passed the api endpoint responsible for handling this function into paystack, which calls this function ONLY when a payment is successful!

  try {
    const {
      data: { reference },
    } = req.body; //The reference is destructured from the body of the request.
    console.log({reference})
    const verificationResponse = await paystack.transaction.verify(reference);

    if (verificationResponse.data.status !== "success")
      throw new Error("Payment verification failed!");

    const {
      items,
      orderedBy,
      totalAmount,
      address,
      coupon,
      couponApplied,
      paymentIntent,
    } = verificationResponse.data.metadata;

    const order = await Order.create({
      items,
      orderedBy,
      totalAmount,
      address,
      coupon,
      couponApplied,
      paymentIntent,
    });

    // //Update the quantity of items left in the database, and also update the amount of the product sold too.
    const updatedProducts = items.map((item) => {
      return {
        updateOne: {
          filter: { _id: item.product },
          update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
        },
      };
    });

    // //BulkWrite is used so that you would not have to take multiple to and fro trips to the database.
    await Product.bulkWrite(updatedProducts, {});

    //Send the notification to the client via websocket
    const clientSocket = clients.get(orderedBy);
    console.log({clientSocket})
    if (clientSocket) {
      clientSocket.emit("paymentVerified", {
        message: "Your order has been created successfully!",
        orderId: order._id,
      });
    }

    console.log("Operation successful!");
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

//READ
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate(
      "orderedBy",
      "firstName lastName email mobile"
    );
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: error.message });
  }
};

const getOrder = async (req, res) => {
  const { id } = req.params;

  try {
    validateMongoDbId(id, "Order");
    const order = await Order.findById(id)
      .populate("orderedBy", "firstName lastName email mobile")
      .populate("items.product", "name");
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ error: error.message });
  }
};

//UPDATE
const updateOrder = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    validateMongoDbId(id, "Order");
    const order = await Order.findByIdAndUpdate(
      id,
      {
        status,
      },
      { new: true, runValidators: true }
    );

    if (!order) throw new Error("Order not found!");

    res.status(201).json({ message: "Order status changed!", order });
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: error.message });
  }
};

//DELETE
const deleteOrder = async (req, res) => {
  const { id } = req.params;
  try {
    validateMongoDbId(id, "Order");
    const order = await Order.findByIdAndDelete(id);
    if (!order) throw new Error("Order not found");
    res.status(200).json({ message: "Order successfully deleted" });
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: error.message });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrder,
  verifyPayment,
  updateOrder,
  deleteOrder,
};
