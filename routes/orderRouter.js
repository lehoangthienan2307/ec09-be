import express from "express";
import orderCtrl from '../controllers/orderCtrl.js'
import {auth} from '../middlewares/auth.js'


const router = express.Router();

router.get('/', orderCtrl.getList)
router.get('/delivery', orderCtrl.getListDelivery)
router.get('/success', orderCtrl.getListSuccess)
router.route('/get')
    .get(orderCtrl.getOrder)
    .patch(orderCtrl.updateState)



export default router