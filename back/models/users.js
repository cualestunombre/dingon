const Sequelize = require("sequelize");


module.exports = class User extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            email:{
                type: Sequelize.STRING(500),
                allowNull:false,
                unique:true
            },
            password:{
                type: Sequelize.STRING(1000),
                allowNull:false
            },
            nickName:{
                type: Sequelize.STRING(1000),
                allowNull:false
            },

        },{
            sequelize,
            timestamps:true,
            underscored:false,
            modelName:"User",
            tableName:"users",
            paranoid:false,
            charset:"utf8mb4",
            collate:"utf8mb4_general_ci"
        });
    }
    static associate(db){
        db.User.hasMany(db.Post,{foreignKey:"userId",targetKey:"id",onDelete:"cascade",onUpdate:"cascade"});
        db.User.belongsToMany(db.Post,{through:'likes',onDelete:"cascade",onUpdate:"cascade"});
        db.User.belongsToMany(db.Post,{through:'dislikes',onDelete:"cascade",onUpdate:"cascade"});
        db.User.hasMany(db.Comment,{foreignKey:"userId",targetKey:"id",onDelete:"cascade",onUpdate:"cascade"});
        db.User.hasMany(db.SubComment,{foreignKey:"userId",targetKey:"id",onDelete:"cascade",onUpdate:"cascade"});
    }
}