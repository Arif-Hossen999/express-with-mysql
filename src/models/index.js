const dbConfig = require('../../config/dbConfig');

const {Sequelize, DataTypes} = require('sequelize');

const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD, {
        host: dbConfig.HOST,
        dialect: dbConfig.dialect,
        operatorsAliases: false,

        pool: {
            max: dbConfig.pool.max,
            min: dbConfig.pool.min,
            acquire: dbConfig.pool.acquire,
            idle: dbConfig.pool.idle

        }
    }
)

sequelize.authenticate()
.then(() => {
    console.log('Database is connected..')
})
.catch(err => {
    console.log('Error'+ err)
})

const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize

// add model with db
db.categories = require('./categoryModel.js')(sequelize, DataTypes)
db.users = require('./userModel.js')(sequelize, DataTypes)
db.posts = require('./postModel.js')(sequelize, DataTypes)
db.post_images = require('./postImageModel.js')(sequelize, DataTypes)
db.post_videos = require('./postVideoModel.js')(sequelize, DataTypes)

db.sequelize.sync({ force: false })
.then(() => {
    console.log('yes re-sync done!')
})

// 1 to Many Relation with posts and users

db.users.hasMany(db.posts, {
    foreignKey: 'user_id',
    as: 'post'
})

db.posts.belongsTo(db.users, {
    foreignKey: 'user_id',
    as: 'user'
})

// 1 to 1 relation with posts and post_image
db.posts.hasOne(db.post_images,{
    foreignKey: 'post_id',
    as: 'post_image'
})

db.post_images.belongsTo(db.posts, {
    foreignKey: 'post_id',
    as: 'post'
})

// 1 to 1 relation with posts and post_videos
db.posts.hasOne(db.post_videos,{
    foreignKey: 'post_id',
    as: 'post_video'
})

db.post_videos.belongsTo(db.posts, {
    foreignKey: 'post_id',
    as: 'post'
})


module.exports = {db, sequelize}
// module.exports = db