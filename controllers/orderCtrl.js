import orderModel from '../models/orderModel.js'
import productModel from '../models/productModel.js'
import userModel from '../models/userModel.js'
import moment from 'moment'
import config from '../config/constants.js'


export default {
    async getOrder(req, res, next) {
        try {
            const { orderID } = req.body;
            const result = await orderModel.getOrderById(orderID);

            if (result === null ) {
                return res.status(200).send({
                    exitcode: 101,
                    message: "Order not found"
                })
            }

            const {
                OrderID,
                OrderDate,
                method,
                address,
                province,
                district,
                ward,
                Total,
                ShipPrice,
                OrderPrice,
            } = result

            const detailList = await productModel.getProductByOrderId(orderID);
            const items = [];
            for (const item of detailList) {
              items.push({
                ProID: item.ProID,
                ProName: item.ProName,
                image: item.image,
                Price: item.Price,
                quantity: item.quantity,
             
              })
            }

            res.status(200).send({
                message: "Get order successfully",
                order: {
                    OrderID,
                    OrderDate,
                    method,
                    province,
                    district,
                    ward,
                    address,
                    Total,
                    ShipPrice,
                    OrderPrice,
                    items
                }
            })
        } catch (err) {
            next(err)
        }
    },

    async getList(req, res, next) {
        try {
            const orderState="Đang chờ xác nhận"
            const email = req.user;
              
            const orderList = await orderModel.getHistoryOrder(email, orderState);
            const items = []
            const orders=[]
            for (const order of orderList) {
            const products = await productModel.getProductByOrderId(order.OrderID);
               for (const item of products) {
                items.push({
                  ProID: item.ProID,
                  ProName: item.ProName,
                  image: item.image,
                  Price: item.Price,
                  quantity: item.quantity,
              })
            }

            orders.push({
                OrderID: order.OrderID,
                OrderDate: order.OrderDate,
                address: order.address,
                province: order.province,
                district: order.district,
                ward: order.ward,
                ShipPrice: order.ShipPrice,
                Total: order.Total,
                method: order.method,
                items: products,

              })
        }
            res.status(200).send({
                exitcode: 0,
                message: "Get list of order successfully",
                orders: orders,
            })
        } catch (err) {
            next(err)
        }
    },
    async getListDelivery(req, res, next) {
        try {
            const orderState="Đang giao"
            const email = req.user;
              
            const orderList = await orderModel.getHistoryOrder(email, orderState);
            const items = []
            const orders=[]
            for (const order of orderList) {
            const products = await productModel.getProductByOrderId(order.OrderID);
               for (const item of products) {
                items.push({
                  ProID: item.ProID,
                  ProName: item.ProName,
                  image: item.image,
                  Price: item.Price,
                  quantity: item.quantity,
              })
            }

            orders.push({
                OrderID: order.OrderID,
                OrderDate: order.OrderDate,
                address: order.address,
                province: order.province,
                district: order.district,
                ward: order.ward,
                ShipPrice: order.ShipPrice,
                Total: order.Total,
                method: order.method,
                items: products,

              })
        }
            res.status(200).send({
                exitcode: 0,
                message: "Get list of order successfully",
                orders: orders,
            })
        } catch (err) {
            next(err)
        }
    },

    async getListSuccess(req, res, next) {
        try {
            const orderState="Đã giao"
            const email = req.user;
              
            const orderList = await orderModel.getHistoryOrder(email, orderState);
            const items = []
            const orders=[]
            for (const order of orderList) {
            const products = await productModel.getProductByOrderId(order.OrderID);
               for (const item of products) {
                items.push({
                  ProID: item.ProID,
                  ProName: item.ProName,
                  image: item.image,
                  Price: item.Price,
                  quantity: item.quantity,
              })
            }

            orders.push({
                OrderID: order.OrderID,
                OrderDate: order.OrderDate,
                address: order.address,
                province: order.province,
                district: order.district,
                ward: order.ward,
                ShipPrice: order.ShipPrice,
                Total: order.Total,
                method: order.method,
                items: products,

              })
        }
            res.status(200).send({
                exitcode: 0,
                message: "Get list of order successfully",
                orders: orders,
            })
        } catch (err) {
            next(err)
        }
    },




    async updateState(req, res, next) {
        try {
            const {orderID}= req.body
            await orderModel.updateState(orderID, 'Đã hủy')
            return res.status(200).send({
                    message: "Update order state successfully"
                })
        } catch (err) {
            next(err)
        }
    }

    
}