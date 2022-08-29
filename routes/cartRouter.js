import cart from '../controllers/cartCtrl.js'
import express from 'express'



const router = express.Router();

router.route('/')
    .get(cart.getCart)
    .post(cart.addToCart)
    .patch(cart.updateCart)
    .delete(cart.deleteProductFromCart)

export default router;