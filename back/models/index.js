const Sequelize = require("sequelize");
const User = require("./users");
const Post = require("./posts");
const PostMedia = require("./postmedia");
const Comment= require("./comments");
const SubComment = require("./subComments");
const Board = require("./boards");
const UserCount = require("./userCount");
const db = {};
const config = require("../config.json")["development"];
const sequelize = new Sequelize(config.database,config.username,config.password, config);
db.sequelize=sequelize;
db.User = User;
db.Post = Post;
db.PostMedia = PostMedia;
db.Comment = Comment;
db.SubComment = SubComment;
db.Board = Board;
db.UserCount=UserCount;

User.init(sequelize);
Post.init(sequelize);
PostMedia.init(sequelize);
Comment.init(sequelize);
SubComment.init(sequelize);
Board.init(sequelize);
UserCount.init(sequelize)

User.associate(db);
Post.associate(db);
PostMedia.associate(db);
Comment.associate(db);
SubComment.associate(db);
Board.associate(db);

db.Concept = sequelize.models.concepts;
db.Like = sequelize.models.likes;
db.Dislike = sequelize.models.dislikes;


module.exports = db;