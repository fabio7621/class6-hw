const express = require("express");
const errorHandle = require("../errorHandle");
const appError = require("../service/appError");
const handleErrorAsync = require("../service/handErrorAsync");
const router = express.Router();
const Post = require("../models/postsModel");
const User = require("../models/usersModel");

router.get("/", async function (req, res, next) {
    try {
        const timeSort = req.query.timeSort == "asc" ? "createdAt" : "-createdAt";
        const q = req.query.q !== undefined ? { content: new RegExp(req.query.q) } : {};
        const posts = await Post.find(q)
            .populate({
                path: "user",
                select: "user photo",
            })
            .sort(timeSort);
        res.status(200).json({
            success: true,
            message: "搜尋成功",
            posts,
        });
    } catch (error) {
        errorHandle(res, error);
    }
});

router.post("/", handleErrorAsync(async function (req, res, next) {
    if (!req.body.content || req.body.content.trim() === "") {
        return next(appError(400, "你沒有填寫 content 資料", next));
    }
    const newPost = await Post.create({ ...req.body, content: req.body.content.trim() });
    res.status(200).json({
        status: "success",
        post: newPost,
    });
}));

router.delete("/posts", async (req, res, next) => {
    try {
        await Post.deleteMany({});
        res.status(200).json({
            status: "success",
            posts: [],
        });
    } catch (error) {
        errorHandle(res, error);
    }
});

router.delete("/post/:id", async (req, res, next) => {
    try {
        const post = await Post.findByIdAndDelete(req.params.id);
        if (!post) {
            return next(appError(404, "找不到貼文", next));
        }
        res.status(200).json({
            status: "success",
            post: post,
        });
    } catch (error) {
        errorHandle(res, error);
    }
});

router.patch("/post/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const { body } = req;
        if (body.content && body.content.trim() === "") {
            return next(appError(400, "content 不能為空白", next));
        }
        const updatedPost = await Post.findByIdAndUpdate(id, { ...body, content: body.content.trim() }, { new: true });
        if (!updatedPost) {
            return next(appError(404, "找不到貼文", next));
        }
        res.status(200).json({
            status: "success",
            post: updatedPost,
        });
    } catch (error) {
        errorHandle(res, error);
    }
});

module.exports = router;
