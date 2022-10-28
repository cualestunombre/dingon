const Sequelize = require("sequelize");


module.exports = class SubComment extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            content:{
                type:Sequelize.STRING(1000),
                allowNull:false,
            },

        },{
            sequelize,
            timestamps:true,
            underscored:false,
            modelName:"SubComment",
            tableName:"subcomments",
            paranoid:false,
            charset:"utf8mb4",
            collate:"utf8mb4_general_ci"
        });
    }
    static associate(db){
        db.SubComment.belongsTo(db.Post,{foreignKey:"postId",sourceKey:"id",onDelete:"cascade",onUpdate:"cascade"});
        db.SubComment.belongsTo(db.Comment,{foreignKey:"commentId",sourceKey:"id",onDelete:"cascade",onUpdate:"cascade"});
        db.SubComment.belongsTo(db.User,{foreignKey:"userId",sourceKey:"id",onDelete:"cascade",onUpdate:"cascade"});
        
    }
}
