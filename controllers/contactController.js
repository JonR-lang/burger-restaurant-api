const nodemailer = require("nodemailer");

const sendEmail = async (data) => {
  console.log(data);
  const { fullName, email, subject, message } = data;

  if (!email || !subject || !body)
    throw new Error("All fileds should be provided!");

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAIL_ID,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: email,
    to: "iroelejohnny@gmail.com",
    subject: `Contact form submission from ${fullName}: ${subject}`,
    text: `You have received a new message from ${email}:\n\n${message}`,
  });
};

module.exports.contact = async (req, res) => {
  const { fullName, email, subject, message } = req.body;
  try {
    if (!fullName || !email || !subject || !message)
      throw new Error("All fileds should be provided!");
    const data = {
      fullName,
      email,
      subject,
      message,
    };
    sendEmail(data);
    res.status(201).json({ message: "Email received successfully!" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};
