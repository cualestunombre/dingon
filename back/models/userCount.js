const Sequelize = require("sequelize");


module.exports = class UserCount extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            socketId:{
                type:Sequelize.STRING(1000),
                allowNull:false
            }

        },{
            sequelize,
            timestamps:true,
            underscored:false,
            modelName:"UserCount",
            tableName:"userCount",
            paranoid:false,
            charset:"utf8mb4",
            collate:"utf8mb4_general_ci"
        });
    }
  
}