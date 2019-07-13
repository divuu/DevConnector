const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

//Load Validation
const validateProfileInput = require("../../validation/profile");
const validateExperienceInput = require("../../validation/experience");
//Load Profile model
const Profile = require("../../models/Profile");
//Load User model
const User = require("../../models/User");

// @route       get api/profile/test
// @description tests post route
// @acess       public
router.get("/test", (req, res) => res.json({ msg: "Profile works" }));

// @route       get api/profile
// @description get current user Profile
// @acess       Private Route(Using JWT tocken that's y Protected)
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};

    Profile.findOne({ user: req.user.id })
      .populate("user", ["name", "avatar"])
      .then(profile => {
        if (!profile) {
          errors.noprofile = "there is no Profile with this user";
          return res.status(400).json(errors);
        }
        res.json(profile);
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route       get api/profile/all
// @description get all profile
// @acess       public
router.get("/all", (req, res) => {
  const errors = {};
  Profile.find()
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "There is no profile";
        res.status(404).json(errors);
      } else {
        res.status(200).json(profile);
      }
    })
    .catch(err => res.json(err));
});

// @route       get api/profile/handle:handle
// @description get profile by handle
// @acess       public

router.get("/handle/:handle", (req, res) => {
  const errors = {};
  Profile.findOne({ handle: req.params.handle })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = " No Profile for this user";
        res.status(404).json(errors);
      } else {
        res.status(200).json(profile);
      }
    })
    .catch(err => res.status(404).json(err));
});

// @route       get api/profile/user:user_id
// @description get profile by user id
// @acess       public

router.get("/user/:user_id", (req, res) => {
  const errors = {};
  Profile.findOne({ user: req.params.user_id })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = " No Profile for this user";
        res.status(404).json(errors);
      } else {
        res.status(200).json(profile);
      }
    })
    .catch(err => res.status(404).json(err));
});

// @route       post api/profile
// @description Create or Update user Profile
// @acess       Private Route(Using JWT tocken that's y Protected)
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);
    //Check Validate
    if (!isValid) {
      //Return any errors with 400
      return res.status(400).json(errors);
    }
    //get Fields
    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.githubusername)
      profileFields.githubusername = req.body.githubusername;
    //Skill -Split into array
    //if (typeof req.body.skills !== "undefined") {
    if (req.body.skills) profileFields.skills = req.body.skills.split(",");
    //}
    //Social
    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

    Profile.findOne({ user: req.user.id }).then(profile => {
      if (profile) {
        //update
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        ).then(profile => res.json(profile));
      } else {
        //create

        //check if hadle exist
        Profile.findOne({
          handle: profileFields.handle
        }).then(profile => {
          if (profile) {
            errors.handle = "Handle already exist";
            res.status(400).json(errors);
          }

          //Save profile
          new Profile(profileFields).save().then(profile => res.json(profile));
        });
      }
    });
  }
);

// @route       post api/profile/experience
// @description add experience to Profile
// @acess       Private Route(Using JWT tocken that's y Protected)
router.post(
  "/experience",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // const { errors, isValid } = validateExperienceInput(req.body);

    // if (!isValid) {
    //   return res.status(400).json(errors);
    // }

    Profile.findOne({ user: req.user.id }).then(profile => {
      const newExp = {
        title: req.body.title,
        company: req.body.company,
        location: req.body.location,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      };
      // Add to experience array
      profile.experience.unshift(newExp);
      profile.save().then(profile => res.status(200).json(profile));
    });
  }
);

// @route       post api/profile/education
// @description add education to Profile
// @acess       Private Route(Using JWT tocken that's y Protected)
router.post(
  "/education",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // const { errors, isValid } = validateEducationInput(req.body);

    // if (!isValid) {
    //   return res.status(400).json(errors);
    // }

    Profile.findOne({ user: req.user.id }).then(profile => {
      const newEdu = {
        school: req.body.school,
        degree: req.body.degree,
        fieldofstudy: req.body.location,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      };
      // Add to experience array
      profile.education.unshift(newEdu);
      profile.save().then(profile => res.status(200).json(profile));
    });
  }
);

// @route       DELETE api/profile/experience/exp_id
// @description delete experience to Profile
// @acess       Private Route(Using JWT tocken that's y Protected)
router.delete(
  "/experience/:exp_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // const { errors, isValid } = validateEducationInput(req.body);

    // if (!isValid) {
    //   return res.status(400).json(errors);
    // }

    Profile.findOne({ user: req.user.id })
      .then(profile => {
        //remove index
        // console.log(profile);
        const removeIndex = profile.experience
          .map(item => {
            console.log(item.id);
            return item.id;
          })
          .indexOf(req.params.exp_id);

        console.log(removeIndex);
        // Splice to experience array
        profile.experience.splice(removeIndex, 1);
        //Save
        profile.save().then(profile => res.status(200).json(profile));
      })
      .catch(err => res.json(err));
  }
);

// @route       DELETE api/profile/education/edu_id
// @description delete experience to Profile
// @acess       Private Route(Using JWT tocken that's y Protected)
router.delete(
  "/education/:edu_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // const { errors, isValid }d = validateEducationInput(req.body);

    // if (!isValid) {
    //   return res.status(400).json(errors);
    // }

    Profile.findOne({ user: req.user.id })
      .then(profile => {
        //remove index
        const removeIndex = profile.education
          .map(item => item.id)
          .indexOf(req.params.edu_id);

        //console.log(removeIndex);
        // Splice to experience array
        profile.education.splice(removeIndex, 1);
        //Save
        profile.save().then(profile => res.status(200).json(profile));
      })
      .catch(err => res.json(err));
  }
);

// @route       DELETE api/profile/
// @description delete Profile and user both
// @acess       Private Route(Using JWT tocken that's y Protected)
router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOneAndRemove({ user: req.user.id })
      .then(() => {
        User.findOneAndRemove({ _id: req.user.id }).then(() =>
          res.json({ success: true })
        );
      })
      .catch(err => res.json(err));
  }
);

module.exports = router;
