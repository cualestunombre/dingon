import Sequelize from "sequelize";
import User from "./users.js";
import Post from "./posts.js";
import Comment from "./comments.js";
import SubComment from "./subComments.js";
import Board from "./boards.js";
import UserCount from "./userCount.js" 
import Config from "../config.json" assert {type:"json"};;
const db = {};
const config = Config["test"];
const sequelize = new Sequelize(config.database,config.username,config.password, config);
db.sequelize=sequelize;
db.User = User;
db.Post = Post;
db.Comment = Comment;
db.SubComment = SubComment;
db.Board = Board;
db.UserCount=UserCount;

User.init(sequelize);
Post.init(sequelize);
Comment.init(sequelize);
SubComment.init(sequelize);
Board.init(sequelize);
UserCount.init(sequelize)

User.associate(db);
Post.associate(db);
Comment.associate(db);
SubComment.associate(db);
Board.associate(db);

db.Concept = sequelize.models.concepts;
db.Like = sequelize.models.likes;
db.Dislike = sequelize.models.dislikes;


export default db;