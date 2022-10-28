const Sequelize = require("sequelize");


module.exports = class Post extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            title:{
                type:Sequelize.STRING(1000),
                allowNull:false
            }
            ,
            content:{
                type:Sequelize.TEXT("long"),
                allowNull:false,
            },
            clicked:{
                type:Sequelize.INTEGER,
                defaultValue:0
            }

        },{
            sequelize,
            timestamps:true,
            underscored:false,
            modelName:"Post",
            tableName:"posts",
            paranoid:false,
            charset:"utf8mb4",
            collate:"utf8mb4_general_ci"
        });
    }
    static associate(db){
        db.Post.hasMany(db.PostMedia,{foreignKey:"postId",targetKey:"id",onDelete:"cascade",onUpdate:"cascade"});
        db.Post.hasMany(db.Comment,{foreignKey:"postId",targetKey:"id",onDelete:"cascade",onUpdate:"cascade"});
        db.Post.hasMany(db.SubComment,{foreignKey:"postId",targetKey:"id",onDelete:"cascade",onUpdate:"cascade"});
        db.Post.belongsToMany(db.User,{through:'likes',onDelete:"cascade",onUpdate:"cascade"});
        db.Post.belongsToMany(db.User,{through:'dislikes',onDelete:"cascade",onUpdate:"cascade"});
        db.Post.belongsToMany(db.Board,{through:'concepts',onDelete:"cascade",onUpdate:"cascade"});
        db.Post.belongsTo(db.Board,{foreignKey:'boardId',sourceKey:"id",onDelete:"cascade",onUpdate:"cascade"});
    }
}