import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import {
	createIncome,
	deleteIncome,
	updateIncome,
} from '../controllers/income.controller.js';

const router = Router();

router.use(verifyJWT);

router.route('/create').post(createIncome);
router.route('/update').patch(updateIncome);
router.route('/delete').delete(deleteIncome);

export default router;
