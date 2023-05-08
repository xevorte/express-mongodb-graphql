import * as Controller from './controller.js';
import express from 'express';

const router = express.Router();

router.use(Controller.Params);
router.get('/', Controller.HomeController);
router.get('/create', Controller.CreateController);
router.post('/create', Controller.StoreController);
router.get('/update/:_id', Controller.EditController);
router.put('/update', Controller.UpdateController);
router.delete('/delete', Controller.DeleteController);

export default router;