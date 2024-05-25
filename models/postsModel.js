const mongoose = require("mongoose");
const postSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.ObjectId,
			ref: "user",
			required: [true, "請填寫名稱"],
		},
		content: {
			type: String,
			required: [true, "內文未填寫"],
		},
		photo: {
			type: String,
			default: "",
		},
	},
	{
		versionKey: false,
		timestamps: true,
	}
);
const Post = mongoose.model("post", postSchema);

module.exports = Post;
