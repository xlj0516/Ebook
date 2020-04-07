const { env } = require('./env')
const UPLOAD_PATH = env ==='dev' ? 'C:/xljNginx/upload/admin-book' : 'root/upload/admin-book/ebook'
const UPLOAD_URL = env === 'dev' ? 'http://localhost:8089/admin-book' : ''
module.exports = {
    CODE_ERROR: -1,
    CODE_SUCCESS: 0,
    CODE_TOKEN_EXPIRED: -2,
    debug: true,
    PWD_SALT: 'admin_imooc_node',
    JWT_EXPIRED: 60 * 60,
    PRIVATE_KEY: 'XULIJUAN',
    UPLOAD_PATH,
    MIME_TYPE_EPUB: 'application/epub+zip',
    UPLOAD_URL
}