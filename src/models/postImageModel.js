module.exports = (sequelize, DataTypes) => {

    const Post_Image = sequelize.define("post_image", {
        imageUrl: {
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
    

    return Post_Image

}