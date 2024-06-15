const express = require("express");
const router = express.Router();
const postController = require("../controllers/postCon");
const { isAuth } = require("../service/auth");
const { getPosts, getOnePost, newPost, deleteAllPosts, deletePost, updatePost } = postController;

// 取得所有貼文
router.get("/", getPosts);

// 取得單篇貼文
router.get("/:id", getOnePost);

// 建立新貼文
router.post("/", isAuth, newPost);

//刪除所有貼文
router.delete("/posts", isAuth, deleteAllPosts);

// 删除指定貼文
router.delete("/post/:id", isAuth, deletePost);

// 更新指定貼文
router.patch("/post/:id", isAuth, updatePost);

module.exports = router;
