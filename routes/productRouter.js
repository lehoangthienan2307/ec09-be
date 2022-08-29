import express from "express";
import {productCtrl} from '../controllers/productCtrl.js'
import {auth} from '../middlewares/auth.js'
import {authAdmin} from '../middlewares/authAdmin.js'

const router = express.Router();

router.get('/', productCtrl.getProducts)
router.get('/:id', productCtrl.getProduct)
router.get('/search/:word', productCtrl.searchProduct)




export default router