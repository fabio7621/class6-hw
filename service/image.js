const multer = require('multer');
const path = require('path');
const upload = multer({
  limits: {  //檔案規格
    fileSize: 2*1024*1024,  //規格不要超過2mb
  },
  fileFilter(req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.jpg' && ext !== '.png' && ext !== '.jpeg') {
      cb(new Error("檔案格式錯誤，僅限上傳 jpg、jpeg 與 png 格式。"));
    }
    cb(null, true);
  },
}).any();

module.exports = upload 