import {checkoutCtrl} from '../controllers/checkoutCtrl.js'
import express from 'express'
import {auth} from '../middlewares/auth.js'



const router = express.Router();
router.get('/provinces', checkoutCtrl.getProvinces)
router.post('/districts', checkoutCtrl.getDistricts)
router.post('/wards', checkoutCtrl.getWards)
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

router.post('/notifyPaypal', checkoutCtrl.notifyPaypal)


export default router;
