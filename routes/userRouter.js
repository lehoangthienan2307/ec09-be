import express from "express";
import {userCtrl} from '../controllers/userCtrl.js'
import {auth} from '../middlewares/auth.js'
import {authAdmin} from '../middlewares/authAdmin.js'

const router = express.Router();

router.post('/register', userCtrl.register)
router.post('/activation', userCtrl.activateEmail)
router.post('/login', userCtrl.login)

router.post('/forgot', userCtrl.forgotPassword)
router.post('/reset', auth, userCtrl.resetPassword)
router.get('/infor', auth, userCtrl.getUserInfor)

router.post('/google_login', userCtrl.googleLogin)



export default router