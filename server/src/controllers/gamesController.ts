import { Request, Response } from 'express';
import pool from '../database';

class GamesController{


  

    public async list (req:Request, res:Response){
      const games = await pool.query('SELECT * FROM games');
      res.json(games);
    } 

    public async getOne(req:Request, res:Response): Promise<any>{
       const { id } = req.params;
       const games = await pool.query('SELECT * FROM games WHERE id = ?', [id]);
       if(games.length > 0){
           return res.json(games[0]);
       }
       res.status(404).json({text: "The game doesn't exist"});

    } 

    public async create (req: Request, resp: Response): Promise<void>{
    //    console.log(req.body);
       await pool.query('INSERT INTO games set ?', [req.body]);
       resp.json({message: 'Game Saved'});
    }

    public async update (req: Request, resp: Response): Promise<void>{
        const {id} = req.params;
        await pool.query("UPDATE games set ? WHERE id = ?", [req.body, id]);
        resp.json({message: 'The was updated'});
     }

    public async delete(req: Request, resp: Response): Promise<void>{
        const { id } = req.params;
        await pool.query('DELETE FROM games WHERE id = ?', [id]);
        resp.json({message: 'The game was deleted'});

    }

}

const gamesController = new GamesController();
export default gamesController;