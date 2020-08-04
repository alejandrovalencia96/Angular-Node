import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

class AuthMiddleware{

    public async validarJWT (req:Request, res:Response, next:NextFunction){
        

        const token = req.header('x-token');
        
        if(!token){
            return res.status(401).json({
                ok: false,
                msg: 'No hay token en la petición'
            });
        }

        try{

            const { id } = jwt.verify(token, 'este-es-el-seed-desarrollo');

            req.body.id = id;
            next();

            // console.log(req.body.id);

        }catch(err){
            return res.status(401).json({
                ok:false,
                msg: 'Token no válido'
            });
        }

      
  
    } 

}

const authMiddleware = new AuthMiddleware();
export default authMiddleware;