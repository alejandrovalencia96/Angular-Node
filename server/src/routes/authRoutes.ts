import { Router } from 'express';
import authController from '../controllers/authController';
import authMiddleware from '../middlewares/validar-jwt';

class GamesRoutes {

   public router: Router = Router();

   constructor(){
    this.config();
   }

   

   config(): void {
       this.router.get('/users', authMiddleware.validarJWT , authController.users);
       this.router.post('/register', authController.create);
       this.router.post('/login', authController.login);

   }

}

const authRoutes = new GamesRoutes();
export default authRoutes.router;