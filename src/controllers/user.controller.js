import UserService from "../services/user.service.js";
import bcrypt from "bcryptjs";

export default class User {
  static async onboard(req, res) {
    try {
      const hash = await bcrypt.hash(req.body.password, 10);
      if (!hash) {
        return res.status(500).json({ message: "Error in Hashing" });
      }
      const createuser = {
        username: req.body.username,
        email: req.body.email,
        mobile: req.body.mobile,
        password: hash
      };
      const user = await UserService.getUser({ email: req.body.email });
      if (user) {
        return res
          .status(409)
          .json({ error: `${createuser.email} Already exist`, success: false });
      }
      await UserService.create(createuser)

        .then((data) => {
          return res.status(200).json({

            message:
              "user has been registered successfully",
            success: true,
            user: data,
          });
        })
        .catch((error) => {
          res.status(500).json({ error: "error in creating new user account" });
        });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }

  static async currentUser(req, res, next) {
    try {
      const user = await UserService.getUser({ username: req.params.username, });
      if (user) {
        res.json({
          status: "success",
          message: "user found!!!",
          user
        });
      } else {
        res.json({ status: "error", message: "user not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }

  static async getFollowers(req, res) {
    try {
      const user = await UserService.getUser({ username: req.params.username, });
      if (user) {
        res.json({
          status: "success",
          message: "user details fetched successfully!!!",
          user: {
            followers: user.followers
          }
        });
      } else {
        res.json({ status: "error", message: "user not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }

  static async getFollowing(req, res) {
    try {
      const user = await UserService.getUser({ username: req.params.username, });
      if (user) {
        res.json({
          status: "success",
          message: "user details fetched successfully!!!",
          user: {
            followings: user.followings
          }
        });
      } else {
        res.json({ status: "error", message: "user not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }

  static async follow(req, res) {
    if (req.body.username !== req.params.username) {
      try {
        const user = await UserService.getUser({ username: req.params.username });
        const currentUser = await UserService.getUser({ username: req.body.username });
        if (!user.followers.includes(req.body.username)) {
          await user.updateOne({ $push: { followers: req.body.username } });
          await currentUser.updateOne({ $push: { followings: req.params.username } });
          res.json({
            status: "success",
            message: "user has been followed!!!",
            user
          });
        } else {
          res.status(403).json("you allready follow this user");
        }
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(403).json("you cant follow yourself");
    }
  }

  static async unfollow(req, res) {
    if (req.body.username !== req.params.username) {
      try {
        const user = await UserService.getUser({ username: req.params.username });
        const currentUser = await UserService.getUser({ username: req.body.username });
        if (user.followers.includes(req.body.username)) {
          await user.updateOne({ $pull: { followers: req.body.username } });
          await currentUser.updateOne({ $pull: { followings: req.params.username } });
          res.json({
            status: "success",
            message: "user has been unfollowed!!!",
            user
          });
        } else {
          res.status(403).json("you dont follow this user");
        }
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(403).json("you cant unfollow yourself");
    }
  }

}
