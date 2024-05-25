const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			require: [true, "請輸入您的名字"],
		},
		email: {
			type: String,
			required: [true, "請輸入您的 Email"],
			unique: true,
			lowercase: true,
		},
		photo: String,
		sex:{
		  type: String,
		  enum:["male","female"]
		},
		password:{
		  type: String,
		  required: [true,'請輸入密碼'],
		  minlength: 8,
		  select: false
		},
	},
	{
		versionKey: false,
		timestamps: false,
	}
);

const User = mongoose.model("user", UserSchema);

module.exports = User;
