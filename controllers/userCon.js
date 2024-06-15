const bcrypt = require("bcryptjs");
const appError = require("../service/appError");
const validator = require("validator");
const User = require("../models/usersModel");
const { generateSendJWT } = require("../service/auth");
const handleErrorAsync = require("../service/handErrorAsync");

module.exports = {
	signUp: handleErrorAsync(async (req, res, next) => {
		let { email, password, confirmPassword, name, sex, photo } = req.body;
		// 內容不可為空
		if (!email || !password || !confirmPassword || !name) {
			return next(appError("400", "欄位未填寫正確！", next));
		}
		// 密碼正確
		if (password !== confirmPassword) {
			return next(appError("400", "密碼不一致！", next));
		}
		// 密碼 8 碼以上
		if (!validator.isLength(password.trim(), { min: 8 })) {
			return next(appError("400", "密碼字數低於 8 碼", next));
		}
		// 暱稱2個字以上
		if (!validator.isLength(name.trim(), { min: 2 })) {
			return next(appError("400", "暱稱字數低於2個字", next));
		}
		// 是否為 Email
		if (!validator.isEmail(email)) {
			return next(appError("400", "Email 格式不正確", next));
		}

		const user = await User.findOne({ email: email });
		if (user) {
			return next(appError("400", "此帳號已被註冊", next));
		}

		// 加密密碼
		password = await bcrypt.hash(password, 12);
		const newUser = await User.create({
			email,
			password,
			name,
			sex,
			photo,
		});
		generateSendJWT(newUser, 201, res);
	}),

	signIn: handleErrorAsync(async (req, res, next) => {
		const { email, password } = req.body;
		if (!email || !password) {
			return next(appError(400, "帳號密碼不可為空", next));
		}
		const user = await User.findOne({ email }).select("+password");
		const auth = await bcrypt.compare(password, user.password);
		if (!auth) {
			return next(appError(400, "您的密碼不正確", next));
		}
		generateSendJWT(user, 200, res);
	}),

	getProfile: handleErrorAsync(async (req, res, next) => {
		res.status(200).json({
			status: "success",
			user: req.user,
		});
	}),

	updatePassword: handleErrorAsync(async (req, res, next) => {
		const { password, confirmPassword } = req.body;
		if (password !== confirmPassword) {
			return next(appError("400", "密碼不一致！", next));
		}
		const newPassword = await bcrypt.hash(password, 12);
		const user = await User.findByIdAndUpdate(req.user.id, {
			password: newPassword,
		});
		generateSendJWT(user, 200, res);
	}),

	updateProfile: handleErrorAsync(async (req, res, next) => {
		const { name, sex, photo } = req.body;

		if (!name) {
			return next(new appError(400, "暱稱不可為空"));
		}
		if (!validator.isLength(name.trim(), { min: 2 })) {
			return next(new appError(400, "暱稱至少 2 個字元以上"));
		}
		if (!sex) {
			return next(new appError(400, "性別不可為空"));
		}
		if (!["male", "female"].includes(sex)) {
			return next(new appError(400, "性別填寫錯誤"));
		}
		if (photo && !validator.isURL(photo, { protocols: ["https"] })) {
			return next(new appError(400, "photo 必須是 https URL"));
		}

		const user = await User.findByIdAndUpdate(
			req.user.id,
			{
				name,
				sex,
				photo,
			},
			{ new: true, runValidators: true }
		);

		if (!user) {
			return next(new appError(400, "更新失敗！"));
		}

		res.status(200).json({
			status: "success",
			data: {
				user,
			},
		});
	}),
};
