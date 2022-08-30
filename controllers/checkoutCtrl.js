import addressModel from '../models/addressModel.js'
import distance from 'google-distance';
import productModel from '../models/productModel.js'
import paymentModel from '../models/paymentModel.js'
import userModel from '../models/userModel.js'
import cartModel from '../models/cartModel.js'
import orderModel from '../models/orderModel.js'
import config from '../config/constants.js'
import PaypalMethod from '../utils/PaypalCheckout.js';
import MomoMethod from '../utils/MomoCheckout.js';
import CodMethod from '../utils/ShipCodCheckout.js';
import { sendEmailOrder } from "./sendMail.js";
import {convert} from '../utils/convertPrice.js'


export const checkoutCtrl ={

   
    async getTempPrice(req, res, next) {
        try {
            const email = req.user;
            const {
                province,
                district,
                ward, 
                address
            } = req.body;

            // Calculate total temp price
            
            const cart = await cartModel.getCart(email);
            const list = await productModel.getProductByCartID(cart.CartID)
            let total = 0;
            let items= [];
            for (const item of list) {

            const product = await productModel.findByProID(item.ProID);
            const amount = product.Price * item.quantity;
            total += amount;
              items.push({
                ProID: item.ProID,
                ProName: item.ProName,
                Price: item.Price,
                quantity: item.quantity,
                Amount: amount,
              })
            }

            const des= `${address}, ${ward}, ${district}, ${province}`
           distance.apiKey = "AIzaSyD_seiLom04fD_r8FSfrSmNFaIiZa7qk80"
            const result = distance.get(
           {	
            origin: "227 Nguyễn Văn Cừ, Phường 4, Quận 5, Thành phố Hồ Chí Minh", 
            destination: des,
            mode: 'driving',
            units: 'metric'
        }, 
        function(err, data) { 
            if (err) {
                console.error(err);
                return res.status(500).json({msg: err.message});
            }
            const shippingDistance = Math.round(data.distanceValue/1000);
            const destination = data.destination
            let shippingPrice = 20000;
            if (shippingDistance > 3)
            {
                shippingPrice += (shippingDistance - 3)*10000
            }
            const totalPrice = total + shippingPrice;
          
            req.body.price = {
                totalOrder: total,
                shippingPrice: shippingPrice,
                totalPrice: totalPrice
            }
            req.body.items = items;
            next()

    })

   
       
        } catch (err) {
            next(err)
        }
    },

    async getPrice(req, res, next) {
        try {
            const { price } = req.body;
            res.status(200).send({
                totalOrder: price.totalOrder,
                shippingPrice: price.shippingPrice,
                totalPrice: price.totalPrice
            })
        } catch (err) {
            next(err)
        }
    },

    async checkout(req, res, next) {
        try {
            const email = req.user;
            const {
                price,
                PaymentID,
                province,
                district,
                ward, 
                address,
                items
            } = req.body;

            if (!province&& !district&& !ward&& !address) {
                return res.status(200).send({
                    message: "Shipping address invalid"
                })
            }

      
            const user = await userModel.findByEmail(email);
            const { name, phone } = user;
            const receiver_info = {
                email: email,
                name: name,
                receiverPhone: phone
            }
   
             const payment = await paymentModel.getById(PaymentID)
     
             const method = payment.method;
             const checkoutMethod = (method === 'Momo') ? (
                new MomoMethod()
            ) :
             ((method === 'Paypal') ? (
                 new PaypalMethod()
             ) : (
                 new CodMethod()
             ))  
 

            // Calculate final price
            const { totalOrder, totalPrice, shippingPrice } = price;
            const convertPrice = Math.round(100 * totalPrice * convert(
                checkoutMethod.getPrice(), 'vnd')) / 100;

   
            const [orderId, redirectUrl] = await checkoutMethod.createLink(
                convertPrice,
                receiver_info,
                `${req.headers.origin}`,
                `${req.protocol}://${req.get('host')}`
      
            );
            console.debug(redirectUrl)
            console.log(orderId)
      
          
            const order = {
                OrderID: orderId,
                email: email,
                PaymentID: PaymentID,
                province:province,
                district:district,
                ward:ward, 
                address:address,
                OrderPrice: totalOrder,
                Total: totalPrice,
                ShipPrice: shippingPrice
            }
            await orderModel.createOrder(orderId,order)
            await orderModel.insertListDetailToOrder(orderId, items);
            await cartModel.deleteCart(email);


            sendEmailOrder(email, order, items);

            // Response
            res.status(200).send({
                exitcode: 0,
                message: "Checkout successfully",
                orderId: orderId,
                redirectUrl: redirectUrl
            })
        } catch (err) {
            next(err)
        }
    },



    async notifyPaypal(req, res, next) {
        try {
            const {
                orderId
            } = req.body;
            const method = new PaypalMethod();

            const data = await method.getDetail(orderId);
            const { status } = data
            if (status !== "APPROVED") {
                await orderModel.updateState(orderId, 'Đã hủy');
                return res.status(200).send({
                    message: "Payment is not approved"
                })
            }

            const capture= await method.capturePayment(orderId);
            if (capture.status === "COMPLETED") {
                await orderModel.updateState(orderId, 'Đang chờ xác nhận');
                res.status(200).send({
                    message: "Payment has been captured"
                });
            } else {
                await orderModel.updateState(orderId, 'Đã hủy');
                res.status(200).send({
                    message: "Payment capture failed"
                })
            }
        } catch (err) {
            next(err)
        }
    },

    //Momo call post
	momoNotify: async (req, res) => {
		try {
			const { orderId, resultCode } = req.body
			const payMethod = new MomoMethod()
			if (!payMethod.notify(req.body))
			{
				res.status(500).json({msg: "Signature is incompatible"})
			}
			//update order
			console.log(resultCode)
			if (resultCode === 0) {
				//success
                await orderModel.updateState(orderId, "Đang chờ xác nhận");
            } 
			else {
                await orderModel.updateState(orderId, "Đã hủy");
            }
			res.status(204).send({}, { headers: {
                    "Content-Type": "application/json" }
            })
		}
		catch (err)
		{
			return res.status(500).json({msg: err.message})
		}
	},

    
    

 
} 
