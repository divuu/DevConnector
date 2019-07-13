const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

//Post Model
const Post = require("../../models/Post");

//Profile Model
const Profile = require("../../models/Profile");

//validation
const validatePostInput = require("../../validation/post");

// @route       get api/posts/test
// @description tests post route
// @acess       public
router.get("/test", (req, res) => res.json({ msg: "posts works normally" }));

// @route       get api/posts
// @description Create post
// @acess       private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);
    //check validation
    if (!isValid) {
      //if any error send status 400
      res.status(400).json(errors);
    }

    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id
    });
    // Save the post
    newPost.save().then(post => {
      res.json(post);
    });
  }
);

// @route       get api/posts
// @description get all post
// @acess       public
router.get("/", (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => res.json(posts));
});

// @route       get api/posts/:id
// @description get all post by id
// @acess       public
router.get("/:id", (req, res) => {
  Post.findById(req.params.id)
    .then(posts => res.json(posts))
    .catch(err => res.json({ mopostfound: "No post found with this id" }));
});

// @route       Delete api/posts/:id
// @description delete post by id
// @acess       private
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          //check for user
          if (post.user.toString() !== req.user.id) {
            return res
              .status(401)
              .json({ notauthorize: "User not authorized to delete the post" });
          } else {
            post.remove().then(() => res.json({ success: true }));
          }
        })
        .catch(err =>
          res.status(400).json({ postotfound: "No post found with this id" })
        );
    });
  }
);

// @route       Post api/posts/like/:id
// @description like the post by postid
// @acess       private
router.post(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length > 0
          ) {
            return res
              .status(400)
              .json({ alreadyliked: "user already liked this post" });
          }
          // Add user id to like array
          post.likes.unshift({ user: req.user.id });

          post.save().then(post => res.json(post));
        })
        .catch(err =>
          res.status(400).json({ postotfound: "No post found with this id" })
        );
    });
  }
);

// @route       Post api/posts/unlike/:id
// @description like the post by postid
// @acess       private
router.post(
  "/unlike/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length === 0
          ) {
            return res
              .status(400)
              .json({ notliked: "You have not yet liked the post" });
          }
          // get remove index
          const removeIndex = post.likes
            .map(item => item.user.toString())
            .indexOf(req.user.id);

          post.likes.splice(removeIndex, 1);

          //Save
          post.save().then(() => {
            res.status(200).json(post);
          });
        })
        .catch(err =>
          res.status(400).json({ postotfound: "No post found with this id" })
        );
    });
  }
);

// @route       Post api/posts/comment/:id
// @description add comment to post by postid
// @acess       private
router.post(
  "/comment/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);
    //check validation
    if (!isValid) {
      //if any error send status 400
      res.status(400).json(errors);
    }
    Post.findById(req.params.id)
      .then(post => {
        const newComment = {
          text: req.body.text,
          name: req.body.name,
          avatar: req.body.avatar,
          user: req.user.id
        };

        //Add comments to array
        post.comments.unshift(newComment);

        //save
        post.save().then(post => res.json(post));
      })
      .catch(err => res.json(err));
  }
);

// @route       Delete api/posts/comment/:id/:comment_id
// @description delete comment to post by postid
// @acess       private
router.delete(
  "/comment/:id/:comment_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then(post => {
        //check to see if comment exist
        if (
          post.comments.filter(
            comment => comment._id.toString() === req.params.comment_id
          ).length === 0
        ) {
          return res
            .status(400)
            .json({ commentnotexist: "comment does not exist" });
        } else {
          //remove index
          const removeIndex = post.comments
            .map(item => item._id.toString())
            .indexOf(req.params.comment_id);

          //Splice comment out of the array
          post.comments.splice(removeIndex, 1);

          post.save().then(post => res.status(200).json(post));
        }
      })
      .catch(err => res.json(err));
  }
);

module.exports = router;
