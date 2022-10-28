const Sequelize = require("sequelize");


module.exports = class Board extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            name:{
                type:Sequelize.STRING(500),
                allowNull:false,
                unique:true
            }

        },{
            sequelize,
            timestamps:true,
            underscored:false,
            modelName:"Board",
            tableName:"boards",
            paranoid:false,
            charset:"utf8mb4",
            collate:"utf8mb4_general_ci"
        });
    }
    static associate(db){
        db.Board.belongsToMany(db.Post,{through:'concepts',onDelete:"cascade",onUpdate:"cascade"});
        db.Board.hasMany(db.Post,{foreignKey:'boardId',targetKey:"id",onDelete:"cascade",onUpdate:"cascade"});
    }
}