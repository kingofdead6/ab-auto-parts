import express from 'express';
import { 
    getCarNames, 
    createCarName, 
    deleteCarName 
} from '../Controllers/carName.js';

const router = express.Router();

router.get('/', getCarNames);

router.post('/', createCarName); 

router.delete('/:id', deleteCarName);

export default router;