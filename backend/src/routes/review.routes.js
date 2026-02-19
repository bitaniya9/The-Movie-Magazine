const ReviewControllers = require("../controllers/review.controllers");
// const adminMiddleware=require("../middlewares/adminMiddleware")
const authMiddleware = require("../middlewares/authMiddleware");
const express = require("express");
const router = express.Router();

router.post("/v1/reviews", authMiddleware, ReviewControllers.postReview);
router.get("/v1/reviews", ReviewControllers.getReview);
router.patch("/v1/reviews/:id", authMiddleware, ReviewControllers.updateReview);
router.delete(
  "/v1/reviews/:id",
  authMiddleware,
  ReviewControllers.deleteReview,
);

module.exports = router;
