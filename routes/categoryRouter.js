import express from "express";
import {categoryCtrl} from '../controllers/categoryCtrl.js'
import {auth} from '../middlewares/auth.js'
import {authAdmin} from '../middlewares/authAdmin.js'

const router = express.Router();

router.get('/getCategory', categoryCtrl.getCategory);





export default router