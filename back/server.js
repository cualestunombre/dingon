import App from "./app.js";
import AuthController from "./controller/authController.js";
import CommentController from "./controller/commentController.js";
import GalleryController from "./controller/galleryController.js";
import PostController from "./controller/postController.js";
import ProfileController from "./controller/profileController.js";
import SearchController from "./controller/searchContoller.js";

async function startServer(){
    const app = new App([
        new AuthController(),
        new CommentController(),
        new GalleryController(),
        new PostController(),
        new ProfileController(),
        new SearchController()

    ]);
    
    app.listen();
}
startServer();