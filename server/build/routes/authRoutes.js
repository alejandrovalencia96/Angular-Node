"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = __importDefault(require("../controllers/authController"));
const validar_jwt_1 = __importDefault(require("../middlewares/validar-jwt"));
class GamesRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/users', validar_jwt_1.default.validarJWT, authController_1.default.users);
        this.router.post('/register', authController_1.default.create);
        this.router.post('/login', authController_1.default.login);
    }
}
const authRoutes = new GamesRoutes();
exports.default = authRoutes.router;
