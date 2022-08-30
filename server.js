import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import authRouter from './routes/userRouter.js'
import categoryRouter from './routes/categoryRouter.js'
import productRouter from './routes/productRouter.js'
import cartRouter from './routes/cartRouter.js'
import checkoutRouter from './routes/checkoutRouter.js'
import orderRouter from './routes/orderRouter.js'
import reviewRouter from './routes/reviewRouter.js'
import activate_session_middleware from './middlewares/session.js';
import {auth} from './middlewares/auth.js'


const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors())
app.use(express.urlencoded({ extended: true }));
activate_session_middleware(app);
app.use('/auth', authRouter)
app.use('/category', categoryRouter)
app.use('/product', productRouter)
app.use('/cart',auth,cartRouter)
app.use('/order',auth, orderRouter)
app.use('/checkout',auth, checkoutRouter)
app.use('/review',auth, reviewRouter)


const PORT = process.env.PORT || 5000
app.listen(PORT, () =>{
    console.log('Server is running on port', PORT)
})