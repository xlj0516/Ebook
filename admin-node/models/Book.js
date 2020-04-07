const {
    MIME_TYPE_EPUB,
    UPLOAD_URL,
    UPLOAD_PATH
} = require('../utils/constant')
const fs = require('fs')
const Epub = require('../utils/epub')
class Book {
    constructor(file, data){
        if(file) {
            this.creatBookFromFile(file)
        } else {
            this.createBookFromData(data)
        }
    }
    creatBookFromFile(file) {
        console.log('createBookFromFile',file)
        const {
            destination,
            filename,
            mimetype = MIME_TYPE_EPUB,
            path,
            originalname
        } = file
        //电子书后缀名
        const suffix = mimetype === MIME_TYPE_EPUB ? '.epub' : ''
        //电子书原有路径
        const oldBookpath = path
        //电子书的新路径
        const bookPath = `${destination}/${filename}${suffix}`
        //电子书的下载url链接
        const url = `${UPLOAD_URL}/book/${filename}${suffix}`
        //电子书解压后的文件夹路径
        const unzipPath = `${UPLOAD_PATH}/unzip/${filename}`
        //电子书解压后的文件夹URL
        const unzipUrl = `${UPLOAD_URL}/unzip/${filename}`
        //创建解压文件夹
        if (!fs.existsSync(unzipPath)) {
            fs.mkdirSync(unzipPath, { recursive:true})
        }
        //重命名文件
        if (fs.existsSync(oldBookpath) && !fs.existsSync(bookPath)) {
            fs.renameSync(oldBookpath, bookPath)
        }
        //封装对象信息
        this.fileName = filename //文件名
        this.path = `/book/${filename}${suffix}` //相对路径
        this.filePath = this.path
        this.unzipPath = `/unzip/${filename}` //epub解压后的相对路径
        this.url = url //epub文件下载的链接
        this.title = '' //书名
        this.author = '' //作者
        this.publisher = '' //出版社
        this.content = [] //目录
        this.cover = '' //封面图片
        this.coverPath = '' //封面图片URL
        this.category = -1 //分类ID
        this.categoryText = '' //分类名称
        this.language = '' //语种
        this.unzipUrl = unzipUrl //解压后文件夹链接
        this.originalname = originalname //电子书文件原名

    }

    createBookFromData(data) {

    }
    parse() {
        return new Promise((resolve, reject) => {
            const bookPath = `${UPLOAD_PATH}${this.filePath}`
            console.log('bookpath',bookPath)
            if (!fs.existsSync(bookPath)) {
                reject(new Error('电子书不存在'))
            }
            const epub = new Epub(bookPath)
            epub.on('error', err => {
                reject(err)
            })
            epub.on('end', err => {
                if (err) {
                    reject(err)
                } else {
                    console.log(epub.metadata)
                    const {
                        language,
                        creator,
                        creatorFileAs,
                        title,
                        cover,
                        publisher
                    } = epub.metadata
                    if(!title){
                        reject(new Error('图书标题为空'))
                    }else{
                        this.title = title
                        this.language = language || 'en'
                        this.author = creator || creatorFileAs || 'unknow'
                        this.punlisher = publisher || 'unknow'
                        this.rootFile = epub.rootFile
                        const handleGetImage = (err, file, mimeType) => {
                            console.log(err, file, mimeType)
                            if(err){
                                reject(err)
                            } else{
                                const suffix = mimeType.split('/')[1]
                                const coverPath = `${UPLOAD_PATH}/img/${this.fileName}.${suffix}`
                                const coverUrl = `${UPLOAD_URL}/img/${this.fileName}.${suffix}`
                                fs.writeFileSync(coverPath, file, 'binary')
                                this.coverPath = `/img/${this.fileName}.${suffix}`
                                this.cover = coverUrl
                                resolve(this)
                            }
                        }
                        epub.getImage(cover,handleGetImage)
                        resolve(this)
                    } 
                }
            })
            epub.parse()
        })
    }
}
module.exports = Book