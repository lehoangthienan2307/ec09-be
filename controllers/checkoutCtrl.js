import addressModel from '../models/addressModel.js'
import distance from 'google-distance';
import productModel from '../models/productModel.js'
import paymentModel from '../models/paymentModel.js'
import userModel from '../models/userModel.js'
import cartModel from '../models/cartModel.js'
import orderModel from '../models/orderModel.js'
import config from '../config/constants.js'
import PaypalMethod from '../utils/PaypalCheckout.js';
import CodMethod from '../utils/ShipCodCheckout.js';
import { sendEmailOrder } from "./sendMail.js";
import MomoMethod from '../utils/MomoCheckout.js';






export const checkoutCtrl ={

     getProvinces: async (req, res) =>{
        try {
            const result = await addressModel.getProvinces();
          
            res.status(200).send({
                provinces: result
            })
        } catch (err) {
            next(err)
        }
    },

     getDistricts: async(req, res)=> {
        try {
            const { TinhID } = req.body
            const result = await addressModel.getDistricts(TinhID);
           
            res.status(200).send({
                districts: result
            })
        } catch (err) {
            res.json({msg:err.message})
        }
    },

     getWards: async (req, res)=> {
        try {
            const { TinhID,QuanID } = req.body;
            const result = await addressModel.getWards(TinhID, QuanID);
            res.status(200).send({
                wards: result
            })
        } catch (err) {
            res.json({msg:err.message})
        }
    },

 

    async getTempPrice(req, res, next) {
        try {
            const email = req.user;
            const {
                province,
                district,
                ward, 
                address,
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


            // Calculate shipping fee
            const des= `${address}, ${ward}, ${district}, ${province}`
            let shippingPrice=0;
    
                distance.apiKey = "AIzaSyCbuwQyCde1CjCoPllUUf9dpC4_6Iy8qCk"
                distance.get(
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
                        shippingPrice = 20000;
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
                        req.body.des = data.destination;
                        console.log(items)
                        next();
                    
    
                })
               
      

            // Calculate total price
            // const totalPrice = total + shippingPrice;
          
            // req.body.price = {
            //     totalOrder: total,
            //     shippingPrice: shippingPrice,
            //     totalPrice: totalPrice
            // }
            // req.body.products = items;

            // next();
        } catch (err) {
            next(err)
        }
    },

    async getPrice(req, res, next) {
        try {
            const { price, des } = req.body;
            res.status(200).send({
                totalOrder: price.totalOrder,
                shippingPrice: price.shippingPrice,
                totalPrice: price.totalPrice,
                destination: des
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
                    message: "Shipping address null"
                })
            }

            // Get user information
            const user = await userModel.findByEmail(email);
            const { name, phone } = user;
            const receiver_info = {
                email: email,
                name: name,
                receiverPhone: phone
            }
            const payment = await paymentModel.getById(PaymentID)
            if (payment === null) {
                return res.status(200).send({
                    message: "Payment null"
                })
            }

            const method = payment.method;
            const checkoutMethod = ((method === 'Paypal') ? (
                new PaypalMethod()
                ) : ((method === 'Momo') ? (
                    new MomoMethod()
                ) : (
                    new CodMethod()
                )))

            // Calculate final price
            const { totalOrder, totalPrice, shippingPrice } = price;
            const convertUSDPrice = (100 * totalPrice )/ 23000;
            
            // Create orderId and link
            const [orderId, redirectUrl] = await checkoutMethod.createLink(
                totalPrice,
                receiver_info,
                `${req.headers.origin}`,
                `${req.protocol}://${req.get('host')}`
            );

            console.log("test")
            console.debug(redirectUrl)

            // Create order
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
            await orderModel.createOrder(order)
            await orderModel.insertListDetailToOrder(orderId, items);
            await cartModel.deleteCart(email);


            sendEmailOrder(to, order, items);

            // Response
            res.status(200).send({
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
            if (captureResponse.status === "COMPLETED") {
                await orderModel.updateState(orderId, 'Xác nhận');
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
    }

    

 
} 