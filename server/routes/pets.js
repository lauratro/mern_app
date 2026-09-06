const express = require("express");
const { randomUUID } = require("crypto");

const router = express.Router();

const userModel = require("../models/usersModel");
const petModel = require("../models/petsModel");
const requireLogin = require("../middleware/requireLogin");

// Get all pets
router.get("/all", (req, res) => {
  petModel.find({}, function (err, pets) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(pets);
    }
  });
});

// Get active lost pets
router.get("/lost", requireLogin, (req, res) => {
  petModel
    .find(
      {
        reportType: "lost",
        status: "active",
      },
      function (err, pets) {
        if (err) {
          res.status(500).json({ error: err.message });
        } else {
          res.json(pets);
        }
      }
    )
    .populate("userId");
});

// Get active found pets
router.get("/found", (req, res) => {
  petModel
    .find(
      {
        reportType: "found",
        status: "active",
      },
      function (err, pets) {
        if (err) {
          res.status(500).json({ error: err.message });
        } else {
          res.json(pets);
        }
      }
    )
    .populate("userId");
});

// Get resolved reports
router.get("/resolved", (req, res) => {
  petModel
    .find({ status: "resolved" }, function (err, pets) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json(pets);
      }
    })
    .populate("userId");
});

// Get single pet
router.get("/details/:id", (req, res) => {
  petModel
    .findOne({ id: req.params.id })
    .populate("userId")
    .exec(function (err, pet) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (!pet) {
        return res.status(404).json({ error: "Pet report not found" });
      }

      res.json(pet);
    });
});

// Create new pet report
router.post("/uploads", (req, res) => {
  const {
    reportType,
    name,
    species,
    breed,
    color,
    location,
    info,
    img,
    userId,
    favorite,
  } = req.body;

  if (!species || !img || !reportType) {
    return res.status(422).json({
      error:
        "Please provide the species, report type and a picture of the animal.",
    });
  }

  const pet = new petModel({
    id: `pet_${randomUUID()}`,
    reportType,
    status: "active",
    name,
    species,
    breed,
    color,
    location,
    info,
    img,
    userId,
    favorite,
  });

  pet
    .save()
    .then((result) => {
      userModel.findByIdAndUpdate(
        userId,
        { $push: { pets: result._id } },
        { new: true },
        function (error) {
          if (error) {
            console.log(error);
          }
        }
      );

      res.status(201).json({
        message: "Pet report created successfully",
        createdPet: result,
      });
    })
    .catch((err) => {
      console.log(err);

      res.status(400).json({
        error: err.message,
      });
    });
});

// Create a comment
router.put("/comments", (req, res) => {
  const comment = {
    text: req.body.text,
    avatar: req.body.avatar,
    username: req.body.username,
    userId: req.body.userId,
  };

  petModel
    .findByIdAndUpdate(
      req.body.petId,
      {
        $push: { comments: comment },
      },
      {
        new: true,
      }
    )
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err.message });
      }

      res.json(result);
    });
});

// Mark report as resolved
router.put("/atHome", (req, res) => {
  petModel.findByIdAndUpdate(
    req.body.petId,
    {
      $set: {
        status: "resolved",
      },
    },
    { new: true },
    function (err, result) {
      if (err) {
        return res.status(422).json({ error: err.message });
      }

      res.json(result);
    }
  );
});

// Delete comment
router.put("/deleteComment/:petId/:commentId", (req, res) => {
  petModel
    .findByIdAndUpdate(
      req.params.petId,
      {
        $pull: {
          comments: {
            _id: req.params.commentId,
          },
        },
      },
      { new: true },
      function (err, data) {
        if (err) {
          return res.status(404).json({ message: "Error" });
        }

        res.send(data);
      }
    )
    .exec();
});

// Add favorite
router.put("/addFavorite", requireLogin, async (req, res) => {
  const userIdReal = req.body.userId;

  try {
    const addOneFav = await petModel.findByIdAndUpdate(
      req.body.petId,
      { $addToSet: { favorite: userIdReal } },
      { new: true }
    );

    const addFavInUser = await userModel.updateOne(
      { _id: userIdReal },
      { $addToSet: { favorites: req.body.petId } }
    );

    res.status(200).json({
      addFavUser: addFavInUser,
      addOneFav,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

// Get quantity/list of favorites
router.get("/favorite/:petId", (req, res) => {
  petModel.findById(req.params.petId, "favorite", function (err, result) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json(result);
  });
});

// Remove favorite
router.put("/removeFavorite", requireLogin, async (req, res) => {
  const userIdReal = req.body.userId;

  try {
    const removeOneFav = await petModel.findByIdAndUpdate(
      req.body.petId,
      { $pull: { favorite: userIdReal } },
      { new: true }
    );

    const removeFavInUser = await userModel.findByIdAndUpdate(
      userIdReal,
      { $pull: { favorites: req.body.petId } },
      { new: true }
    );

    res.status(200).json({
      removeFavUser: removeFavInUser,
      removeOneFav,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

// Delete post
router.post("/deletePost", (req, res) => {
  const postId = req.body.postId;

  petModel
    .findOneAndRemove({ _id: postId })
    .then(() => {
      return Promise.all([
        userModel.updateOne(
          { pets: postId },
          {
            $pull: {
              pets: postId,
            },
          }
        ),

        userModel.updateMany(
          { favorites: postId },
          {
            $pull: {
              favorites: postId,
            },
          }
        ),
      ]);
    })
    .then(() => {
      res.json({ message: "success" });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err.message });
    });
});

module.exports = router;
