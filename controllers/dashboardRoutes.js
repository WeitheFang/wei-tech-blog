const router = require("express").Router();
const { Post, User } = require("../models");
const withAuth = require("../utils/auth");

// GET all posts for dashboard
router.get("/", withAuth, async (req, res) => {
  try {
    const postData = await Post.findAll({
      where: {
        userId: req.session.userId,
      },
      include: [
        {
          model: User,
          attributes: ["name"],
        },
      ],
    });
    const posts = postData.map((post) => post.get({ plain: true }));
    res.render("dashboard", {
      posts,
      loggedIn: true,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET one post from dashboard
router.get("/edit/:id", withAuth, async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ["name"],
        },
      ],
    });
    const post = postData.get({ plain: true });
    res.render("edit-post", {
      ...post,
      loggedIn: true,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET add new post
router.get("/new", withAuth, async (req, res) => {
  try {
    res.render("new-post", {
      loggedIn: true,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
