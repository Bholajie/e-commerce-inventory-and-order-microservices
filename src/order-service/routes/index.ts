import { Router } from 'express';
import { OrderController } from '../controllers/OrderController';

const router = Router();
const controller = new OrderController();

router.post('/orders', (req, res) => controller.createOrder(req, res));
router.get('/orders/:orderNumber', (req, res) => controller.getOrder(req, res));

export default router;