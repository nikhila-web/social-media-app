import express from "express";
const router = express.Router();
import User from "./src/controllers/user.controller.js";

router.post("/users", User.onboard);
router.get("/users/:username/followers", User.getFollowers);
router.get("/user/:username", User.currentUser);
router.put("/users/:username/follow", User.follow);
router.put("/users/:username/unfollow", User.unfollow);
router.get("/users/:username/following", User.getFollowing);

export default router;
