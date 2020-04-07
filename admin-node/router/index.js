const express = require('express')
const boom = require('boom');
const userRouter = require('./user')
const bookRouter = require('./book')
const jwtAuth = require('./jwt')
const Result = require('../models/Resule')

//注册路由
const router = express.Router();
router.use(jwtAuth)
router.get('/',function(req, res){
    res.send('欢迎来到徐立娟世界')
})

//形成路由嵌套 ---> /user/info
router.use('/vue-element-admin/user',userRouter)
router.use('/book',bookRouter)
/**
 * 集中处理404请求的中间件
 * 注意：该中间件必须放在正常处理流程之后
 * 否则，会拦截正常请求
 */
router.use((req,res,next) => {
    next(boom.notFound('接口不存在'))
})
/**
 * 自定义路由异常处理中间件
 * 注意两点：
 * 1、方法的参数不能减少
 * 2、方法必须放在路由最后
 */
router.use((err, req, res, next) => {
    //token验证
    if (err.name && err.name === 'UnauthorizedError') {
        const { status = 401, message } = err;
        new Result(null, 'Token验证失败', {
            erroe:status,
            errMsg: message
        }).token(res.status(status))
    } else {
        const msg = (err && err.message) || '系统错误'
        const statusCode = (err.output && err.output.statusCode) || 500;
        const errorMsg = (err.output && err.output.payload && err.output.payload.error) || err.message;
        new Result(null, msg, {
            error: statusCode,
            errorMsg
        }).fail(res.status(statusCode))
    }
})


module.exports = router;