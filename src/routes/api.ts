import { Router } from "express";
import * as multer from "multer";
import multerStorage from "../config/Multer";
import PlayerController from "../controllers/api/PlayerController";
import ApiAuthController from "../controllers/api/ApiAuthContoller";
import { ApiAuthMiddleware } from "../middleware/ApiMiddleware";
import DashboardController from "../controllers/api/DashboardController";

const router = Router();

router
  .get("/players/landingpage", PlayerController.landingPage)
  .get("/players/:id/detail", PlayerController.detailPage)
  .get("/players/category", PlayerController.allCategory)
  .post("/players/checkout", ApiAuthMiddleware, PlayerController.checkout)
  .get("/players/history", ApiAuthMiddleware, DashboardController.history)
  .get("/players/history/:id", ApiAuthMiddleware, DashboardController.historyDetail)
  .get("/players/dashboard", ApiAuthMiddleware, DashboardController.dashboard)
  .get("/players/profile", ApiAuthMiddleware, PlayerController.profile)
  .put("/players/profile", 
    ApiAuthMiddleware, 
    multer({ storage: multerStorage }).single("avatar"),
    PlayerController.profileEdit
  );

router
  .get("/auth/signup", multer({ storage: multerStorage }).single("avatar"), ApiAuthController.signup)
  .get("/auth/signin",  ApiAuthController.signin);

export default router;