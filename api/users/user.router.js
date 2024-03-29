const router = require("express").Router();
const { checkToken } = require("../../auth/token_validation");
const {
  signUp,
  login,
  addTrain,
  getTrain,
  bookTrain
} = require("./user.controller");




router.post("/signup", signUp);
router.post("/login", login);
router.get("/train/availability:?",getTrain) 
router.post("/trains/:id/book",checkToken,bookTrain) 
router.post("/trains/create",addTrain);

module.exports = router;
