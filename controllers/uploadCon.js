const appError = require("../service/appError");
const errorHandle = require("../service/handErrorAsync");
const { v4: uuidv4 } = require('uuid');
const firebaseAdmin = require('../service/firebase');
const bucket = firebaseAdmin.storage().bucket();

module.exports = {
    uploadCon: errorHandle(async (req, res, next) => {
        if (!req.files || !req.files.length) {
            return next(appError(400, "尚未上傳檔案", next));
        }

        // 取得上傳的檔案資訊列表裡面的第一個檔案
        const file = req.files[0];
        // 基於檔案的原始名稱建立一個 blob 物件
        const blob = bucket.file(`images/${uuidv4()}.${file.originalname.split('.').pop()}`);
        // 建立一個可以寫入 blob 的物件
        const blobStream = blob.createWriteStream();

        // 監聽上傳狀態，當上傳完成時，會觸發 finish 事件
        blobStream.on('finish', () => {
            // 設定檔案的存取權限
            const config = {
                action: 'read', // 權限
                expires: '12-31-2500', // 網址的有效期限
            };
            // 取得檔案的網址
            blob.getSignedUrl(config, (err, fileUrl) => {
                if (err) {
                    return next(appError(500, "取得檔案網址失敗", next));
                }
                res.status(200).json({
                    status: "success",
                    imgUrl: fileUrl
                });
            });
        });

        // 將檔案內容寫入 blob
        blobStream.end(file.buffer);

        // 監聽上傳錯誤事件
        blobStream.on('error', (err) => {
            next(appError(500, "檔案上傳失敗", next));
        });
    })
};