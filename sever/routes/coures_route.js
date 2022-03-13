/* eslint-disable no-underscore-dangle */
const router = require("express").Router();
const { Course } = require("../models");
const { courseValidation } = require("../validation");

router.use((req, res, next) => {
  console.log("A request is coming into api");
  next();
});

router.get("/test", (req, res) => {
  req.logOut();
  const msgObj = {
    message: "Test APi Logout.",
    user: req.user,
    isLogin: req.isAuthenticated(),
  };
  return res.json(msgObj);
});

router.get("/", (req, res) => {
  Course.find({})
    .populate("instructor", ["username", "email"])
    .then((course) => {
      res.send(course);
    })
    .catch((error) => {
      console.log(error);
      res.state(500).send("Error");
    });
});

router.get("/:_id", (req, res) => {
  const { _id } = req.params;
  Course.findOne({ instructor: _id })
    .populate("instructor", ["email"])
    .then((course) => {
      res.send(course);
    })
    .catch((error) => {
      res.send(error);
    });
});

router.post("/", async (req, res) => {
  const { error } = courseValidation(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  const { title, description, price } = req.body;
  if (req.user.isStudent()) {
    res.status(400).send("Only instructor can post a new course");
    return;
  }

  const newCourse = new Course({
    title,
    description,
    price,
    instructor: req.user._id,
  });

  try {
    await newCourse.save();
    res.status(200).send("New Course has been saved");
  } catch (err) {
    console.log(err);
    res.status(400).send("Cannot save course");
  }
});

router.patch("/:_id", async (req, res) => {
  const { error } = courseValidation(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  const { _id } = req.params;
  const course = await Course.findOne({ _id });
  if (!course) {
    res.status(404).json({
      success: false,
      message: "Course not found.",
    });
    return;
  }

  if (course.instructor.equals(req.user._id) || req.user.isAdmin()) {
    Course.findOneAndUpdate({ _id }, req.body, {
      new: true,
      runValidators: true,
    })
      .then(() => {
        res.send("Course updated");
      })
      .catch((err) => {
        res.send({
          success: false,
          message: err,
        });
      });
  } else {
    res.status(403).json({
      success: false,
      message:
        "Only the instructor of this course or web admin can edit this course.",
    });
  }
});

router.delete("/:_id", async (req, res) => {
  const { _id } = req.params;
  const course = await Course.findOne({ _id });
  if (!course) {
    res.status(404).json({
      success: false,
      message: "Course not found.",
    });
  }

  if (course.instructor.equals(req.user._id) || req.user.isAdmin()) {
    Course.deleteOne({ _id })
      .then(() => res.send("Course deleted"))
      .catch((err) => {
        res.send({
          success: false,
          message: err,
        });
      });
  } else {
    res.status(403).json({
      success: false,
      message:
        "Only the instructor of this course or web admin can delete this course.",
    });
  }
});

module.exports = router;
