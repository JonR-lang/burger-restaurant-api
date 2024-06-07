const { Router } = require("express");
const router = Router();
const { contact } = require("../controllers/contactController");

router.post("/", contact);

module.exports = router;
