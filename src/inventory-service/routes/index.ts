import { Router } from 'express';
import { InventoryController } from '../controllers/InventoryController';

const router = Router();
const controller = new InventoryController();

router.post('/items', (req, res) => controller.addItem(req, res));
router.put('/items/:sku/stock', (req, res) => controller.updateStock(req, res));
router.get('/items/:sku', (req, res) => controller.getItem(req, res));
router.post('/check-stock', (req, res) => controller.checkStock(req, res));

export default router;