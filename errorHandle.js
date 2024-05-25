const errorHandle=function(res,error){
    res.status(400).json({
        "status": "false",
        "message":"輸入內容錯誤",
        "error":error
      })
}
module.exports=errorHandle;