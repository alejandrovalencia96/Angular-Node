import { Request, Response } from 'express';
import pool from '../database';
import bcrypt from 'bcryptjs';

import jwt from 'jsonwebtoken';
// const jwt = require('jsonwebtoken');
// const {generarJWT} = require('../helpers/jwt.js');




class AuthController{

  
    public async users (req:Request, res:Response){
        const users = await pool.query('SELECT * FROM users');
        return res.json({
            ok: true,
            users,
            id: req.body.id
        });
      }        


     public async login(req:Request, res:Response): Promise<any>{
       const { email, password } = req.body;
       const user = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
       if(user.length == 0){
           return res.status(400).json({text: "Email no encontrado"}); 
       }
       //verificar contraseña
       const validPassword = bcrypt.compareSync(password, user[0].password);
       if(!validPassword){
           return res.status(400).json({text: "Contraseña no valida"})
       }

      //generar el TOKEN - JWT
      const token = jwt.sign({
            id: user[0].id,
            nombre: user[0].nombre
      }, 'este-es-el-seed-desarrollo', {expiresIn: '3600'});

        
       return res.json({
           ok:true,
           token,
        });

      
    } 

    public async create (req: Request, res: Response): Promise<any>{
    //    console.log(req.body);
       const { email, password } = req.body;

       const emailExist = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
       if(emailExist.length > 0){
           return res.status(400).json({text: "El correo ya se encuentra registrado"});
       }

       //Encriptar contraseña
       const salt = bcrypt.genSaltSync();
       req.body.password = bcrypt.hashSync(password, salt);
      
       const query = await pool.query('INSERT INTO users set ?', [req.body]);

       console.log(query.insertId);

        //generar el TOKEN - JWT
        const token = jwt.sign({
        id: query.insertId,
        nombre: req.body.nombre
        }, 'este-es-el-seed-desarrollo', {expiresIn: '3600'});


       res.json({message: 'user Saved', user: req.body, token});
    }

    // public async update (req: Request, resp: Response): Promise<void>{
    //     const {id} = req.params;
    //     await pool.query("UPDATE games set ? WHERE id = ?", [req.body, id]);
    //     resp.json({message: 'The was updated'});
    //  }

    // public async delete(req: Request, resp: Response): Promise<void>{
    //     const { id } = req.params;
    //     await pool.query('DELETE FROM games WHERE id = ?', [id]);
    //     resp.json({message: 'The game was deleted'});

    // }

}

const authController = new AuthController();
export default authController;