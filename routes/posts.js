const express = require("express");
const router = express.Router();
const errorHandle = require("../service/handErrorAsync");
const appError = require("../service/appError");
const Post = require("../models/postsModel");
const User = require("../models/usersModel");
const postController = require("../controllers/postCon");
const { getPosts, newPost, deleteAllPosts, deletePost, updatePost } = postController;

// 取得所有貼文
router.get("/", getPosts);

// 建立新貼文
router.post("/", newPost);

//刪除所有貼文
router.delete("/posts", deleteAllPosts);

// 删除指定貼文
router.delete("/post/:id", deletePost);

// 更新指定貼文
router.patch("/post/:id", updatePost);

module.exports = router;
