import {checkoutCtrl} from '../controllers/checkoutCtrl.js'
import express from 'express'
import {auth} from '../middlewares/auth.js'
import {paymentCtrl} from '../controllers/paymentCtrl.js'


const router = express.Router();

router.post(
    '/', 
    auth, 
    checkoutCtrl.getTempPrice, checkoutCtrl.checkout
)

router.post(
    '/price', 
    auth, 
   checkoutCtrl.getTempPrice, checkoutCtrl.getPrice
);





router.post('/notifyPaypal',auth, checkoutCtrl.notifyPaypal)
router.post('/notifyMomo',checkoutCtrl.notifyMomo)

export default router;
