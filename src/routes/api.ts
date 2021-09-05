import { Router } from "express";
import * as multer from "multer";
import multerStorage from "../config/Multer";
import PlayerController from "../controllers/api/PlayerController";
import ApiAuthController from "../controllers/api/ApiAuthContoller";
import { ApiAuthMiddleware } from "../middleware/ApiMiddleware";
import DashboardController from "../controllers/api/DashboardController";

const router = Router();

router
  .get("/player/landingpage", PlayerController.landingPage)
  .get("/player/:id/detail", PlayerController.detailPage)
  .get("/player/category", PlayerController.allCategory)
  .post("/player/checkout", ApiAuthMiddleware, PlayerController.checkout)
  .get("/player/history", ApiAuthMiddleware, DashboardController.history)
  .get("/player/history/:id", ApiAuthMiddleware, DashboardController.historyDetail)
  .get("/player/dashboard", ApiAuthMiddleware, DashboardController.dashboard)
  .get("/player/profile", ApiAuthMiddleware, PlayerController.profile)
  .put("/player/profile", 
    ApiAuthMiddleware, 
    multer({ storage: multerStorage }).single("avatar"),
    PlayerController.profileEdit
  );

router
  .get("/auth/signup", multer({ storage: multerStorage }).single("avatar"), ApiAuthController.signup)
  .get("/auth/signin",  ApiAuthController.signin);

export default router;