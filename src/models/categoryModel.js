module.exports = (sequelize, DataTypes) => {

    const Category = sequelize.define("category", {
        category_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
        },
    }, {
        timestamps: true, // This adds createdAt and updatedAt columns
    });
    

    return Category

}