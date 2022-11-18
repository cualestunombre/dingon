import { Server} from "socket.io";
import Sequelize from "./models/index.js";

export default (server,app,sessionMiddleware)=>{
    const io = new Server(server,{path:'/socket.io',  cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }});
    app.set("io",io);
    const count = io.of("/count");
    count.on("connection",async(socket)=>{
        await Sequelize.UserCount.create({socketId:socket.id});
        socket.on("disconnect",async()=>{
            await Sequelize.UserCount.destroy({where:{socketId:socket.id}});
        });
    });
  
}