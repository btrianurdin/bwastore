import { Router } from "express";
import * as multer from "multer";
import HomeController from "../controllers/HomeController";
import CategoryController from "../controllers/CategoryController";
import NominalController from "../controllers/NominalController";
import VoucherController from "../controllers/VoucherController";
import PaymentController from "../controllers/PaymentController";
import BankController from "../controllers/BankController";
import AuthController from "../controllers/AuthController";
import TransactionController from "../controllers/TransactionController";
import multerStorage from "../config/Multer";
import AuthMiddleware from "../middleware/AuthMiddleware";

const router = Router();

/**
 * Home Router
 */
router.get("/", AuthMiddleware, HomeController.index);

/**
 * Category Router
 */
router
    .all("/category*", AuthMiddleware)
    .get("/category", CategoryController.index)
    .get("/category/create", CategoryController.create)
    .post("/category", CategoryController.store)
    .get("/category/:id/edit", CategoryController.edit)
    .put("/category/:id", CategoryController.update)
    .delete("/category/:id", CategoryController.destroy);

/**
 * Nominal Router
 */
router
  .all("/nominal*", AuthMiddleware)
  .get("/nominal", NominalController.index)
  .get("/nominal/create", NominalController.create)
  .post("/nominal", NominalController.store)
  .get("/nominal/:id/edit", NominalController.edit)
  .put("/nominal/:id", NominalController.update)
  .delete("/nominal/:id", NominalController.destroy);

/**
 * Voucher Router
 */
router
    .all("/voucher*", AuthMiddleware)
    .get("/voucher", VoucherController.index)
    .get("/voucher/create", VoucherController.create)
    .post("/voucher", multer({ storage: multerStorage }).single("thumbnail"), VoucherController.store)
    .get("/voucher/:id/edit", VoucherController.edit)
    .put("/voucher/:id/status", VoucherController.updateStatus)
    .put("/voucher/:id", multer({ storage: multerStorage }).single("thumbnail"), VoucherController.update)
    .delete("/voucher/:id", VoucherController.destroy);

/**
 * Bank Router
 */
router
    .all("/bank*", AuthMiddleware)
    .get("/bank", BankController.index)
    .get("/bank/create", BankController.create)
    .post("/bank", BankController.store)
    .get("/bank/:id/edit", BankController.edit)
    .put("/bank/:id", BankController.update)
    .delete("/bank/:id", BankController.destroy);

/**
 * Payment Router
 */
router
    .all("/payment*", AuthMiddleware)
    .get("/payment", PaymentController.index)
    .get("/payment/create", PaymentController.create)
    .post("/payment", PaymentController.store)
    .get("/payment/:id/edit", PaymentController.edit)
    .put("/payment/:id", PaymentController.update)
    .delete("/payment/:id", PaymentController.destroy);

/**
 * Auth Router
 */
router
  .get("/login", AuthController.loginIndex)
  .post("/login", AuthController.loginAction)
  .get("/logout", AuthController.logout);

/**
 * Transaction Router
 */
router
  .all("/transaction*", AuthMiddleware)
  .get("/transaction", TransactionController.index)
  .put("/transaction/:id/status", TransactionController.updateStatus);
export default router;