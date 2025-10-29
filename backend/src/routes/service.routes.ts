import { Router } from 'express';
import { getAllServices, getServiceById } from '../controllers/service.controller';

const router = Router();

router.get('/', getAllServices);
router.get('/:id', getServiceById);

export default router;
