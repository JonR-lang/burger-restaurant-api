const Newsletter = require("../models/Newsletter");
const sendMail = require("./emailController");

module.exports.subscribe = async (req, res) => {
  const { email } = req.body;
  try {
    const newSubscription = new Newsletter({ email });
    await newSubscription.save();
    res
      .status(201)
      .json({ message: "Subscription successful", data: newSubscription });
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate email error
      res.status(400).json({ error: "Email is already subscribed" });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports.unsubscribe = async (req, res) => {
  const { email } = req.query;

  try {
    if (!email) throw new Error("No email provided!");

    const result = await Newsletter.findOneAndDelete({ email });
    if (!result) {
      throw new Error("Email not found");
    }
    res.status(200).json({ message: "Unsubscribed successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.getSubscribers = async (req, res) => {
  try {
    const subscribers = await Newsletter.find();
    res.status(200).json(subscribers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.sendNewsletter = async (req, res) => {
  try {
    const { mail } = req.body;
    const subscribers = await NewsLetter.find();

    if (subscribers.length === 0) throw new Error("No subscribers found");

    const emails = subscribers.map((subscriber) => subscriber.email);

    const emailData = {
      to: emails,
      subject: mail.subject,
      mail: mail.text,
      html: mail.html,
    };
    sendMail(emailData);
    res.status(201).json({ message: "Emails sent successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
