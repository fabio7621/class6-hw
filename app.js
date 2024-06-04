const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const indexRouter = require("./routes/index");
const postRouter = require("./routes/posts");

dotenv.config({ path: "./config.env" });

const app = express();

const DB = process.env.DATABASE.replace(
	"<password>",
	process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then((res) => console.log("連線資料成功",res));
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/posts", postRouter);
module.exports = app;

// 404 錯誤
app.use(function (req, res, next) {
	res.status(404).json({
		status: "error",
		message: "無此路由資訊",
	});
});


// 未捕捉到的 catch

//透過 uncaughtException 的捕捉來將錯誤紀錄在 log
process.on("uncaughtException", (err) => {
	console.error("Uncaughted Exception！");
	console.error(err);
	process.exit(1);
});

process.on("unhandledRejection", (err, promise) => {
	console.error("未捕捉到的 rejection：", promise, "原因：", err);
	//把錯誤整包拉出來  然後再看error
});

//unhandledRejection 不是 Express 或 Node.js 的預設方法，而是 Node.js 的一個事件
//。當一個 Promise 被拒絕，但在事件迴圈的回合中沒有處理它時，unhandledRejection 事件會被觸發。
//這個事件讓你可以在應用程式中捕捉到未被處理的 Promise rejection，並進行相應的處理
const resErrorProd = (err, res) => {
	if (err.isOperational) {
		res.status(err.statusCode).json({
			message: err.message,
		});
	} else {
		// log 紀錄
		console.error("出現重大錯誤", err);
		// 送出罐頭預設訊息
		res.status(500).json({
			status: "error",
			message: "系統錯誤，請恰系統管理員",
		});
	}
};
// 開發環境錯誤
const resErrorDev = (err, res) => {
	res.status(err.statusCode).json({
		message: err.message,
		error: err,
		stack: err.stack,
	});
};
// 錯誤處理
app.use(function (err, req, res, next) {
	// dev
	err.statusCode = err.statusCode || 500;
	if (process.env.NODE_ENV === "dev") {
		return resErrorDev(err, res);
	}
	// production。moongose
	if (err.name === "ValidationError") {
		err.message = "資料欄位未填寫正確，請重新輸入！";
		err.isOperational = true;
		return resErrorProd(err, res);
	}
	resErrorProd(err, res);
});
