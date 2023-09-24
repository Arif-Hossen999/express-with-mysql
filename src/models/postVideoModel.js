module.exports = (sequelize, DataTypes) => {

    const Post_Video = sequelize.define("post_video", {
        videoUrl: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        post_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        status: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
        },
    }, {
        timestamps: true, 
    });
    

    return Post_Video

}