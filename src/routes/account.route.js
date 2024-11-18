import { Router } from 'express';
import {
	createAccount,
	deleteAccountById,
	getAccounts,
	updateAccountById,
} from '../controllers/account.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(verifyJWT);

router.route('/create').post(createAccount);
router.route('/getAll').get(getAccounts);
router.route('/update').patch(updateAccountById);
router.route('/delete').delete(deleteAccountById);

export default router;
