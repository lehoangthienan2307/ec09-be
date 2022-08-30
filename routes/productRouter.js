import express from "express";
import {productCtrl} from '../controllers/productCtrl.js'
import {checkoutCtrl} from '../controllers/checkoutCtrl.js'


const router = express.Router();

router.get('/', productCtrl.getProducts)
router.get('/:id', productCtrl.getProduct)
router.get('/search/:word', productCtrl.searchProduct)
router.get('/best', productCtrl.getTopSale)

router.post('/notifyMomo', checkoutCtrl.notifyMomo)



export default router