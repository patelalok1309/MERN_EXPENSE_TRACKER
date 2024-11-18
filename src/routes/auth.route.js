import { Router } from 'express';

import {
	loginUser,
	registerUser,
	verifyUser,
} from '../controllers/user.controller.js';

const router = Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/verify').post(verifyUser);

export default router;
