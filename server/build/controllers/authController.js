"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../database"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// const jwt = require('jsonwebtoken');
// const {generarJWT} = require('../helpers/jwt.js');
class AuthController {
    users(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield database_1.default.query('SELECT * FROM users');
            return res.json({
                ok: true,
                users,
                id: req.body.id
            });
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            const user = yield database_1.default.query('SELECT * FROM users WHERE email = ?', [email]);
            if (user.length == 0) {
                return res.status(400).json({ text: "Email no encontrado" });
            }
            //verificar contraseña
            const validPassword = bcryptjs_1.default.compareSync(password, user[0].password);
            if (!validPassword) {
                return res.status(400).json({ text: "Contraseña no valida" });
            }
            //generar el TOKEN - JWT
            const token = jsonwebtoken_1.default.sign({
                id: user[0].id,
                nombre: user[0].nombre
            }, 'este-es-el-seed-desarrollo', { expiresIn: '3600' });
            return res.json({
                ok: true,
                token,
            });
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //    console.log(req.body);
            const { email, password } = req.body;
            const emailExist = yield database_1.default.query('SELECT * FROM users WHERE email = ?', [email]);
            if (emailExist.length > 0) {
                return res.status(400).json({ text: "El correo ya se encuentra registrado" });
            }
            //Encriptar contraseña
            const salt = bcryptjs_1.default.genSaltSync();
            req.body.password = bcryptjs_1.default.hashSync(password, salt);
            const query = yield database_1.default.query('INSERT INTO users set ?', [req.body]);
            console.log(query.insertId);
            //generar el TOKEN - JWT
            const token = jsonwebtoken_1.default.sign({
                id: query.insertId,
                nombre: req.body.nombre
            }, 'este-es-el-seed-desarrollo', { expiresIn: '3600' });
            res.json({ message: 'user Saved', user: req.body, token });
        });
    }
}
const authController = new AuthController();
exports.default = authController;
