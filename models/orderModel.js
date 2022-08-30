import db from '../utils/db.js'



export default {
    async getOrderById(id) {
        const result = await db('orders').where({
            'orders.OrderID': id
        })
             .join('orderstatus', 'orderstatus.OrderID', 'orders.OrderID')
            .join('payment', 'orders.PaymentID', 'payment.PaymentID')
            .select(
                'orders.OrderID',
                "orders.email", 
                "orders.OrderDate",
                "orderstatus.Status",
                "payment.method",
                "orders.address",
                "orders.province",
                "orders.district",
                "orders.ward",
                "orders.Total",
                "orders.ShipPrice",
                "orders.OrderPrice",
               
            )
            .orderBy('orders.OrderDate', 'desc')
        return result[0] || null;
    },

    async getHistoryOrder(email, orderState) {
      
        const result = await db('orders')
        .join('orderstatus','orderstatus.OrderID','orders.OrderID')
        .join('payment', 'orders.PaymentID', 'payment.PaymentID')
        .where({'orders.email':email, 'orderstatus.Status': orderState})
        .select(
            'orders.OrderID',
            "orders.email", 
            "orders.OrderDate",
            "orderstatus.Status",
            "payment.method",
            "orders.address",
            "orders.province",
            "orders.district",
            "orders.ward",
            "orders.Total",
            "orders.ShipPrice",
            "orders.OrderPrice",
           
        )
        .orderBy('orderstatus.time', 'desc')
        return result || null;
    },


    async createOrder(OrderID,entity) {
        const order = await db('orders').insert(entity)

        await db('orderstatus').insert({
            'OrderID': OrderID
        })

    },

    async updateState(orderId, orderState) {
        return db('orderstatus')
        .where('OrderID', orderId)
        .update({
            Status: orderState
        })
       
    },

    async insertListDetailToOrder(OrderID,listProduct) {

        const list = listProduct.map(item => ({
            OrderID: OrderID,
            ProID: item.ProID,
            Price: item.Price,
            Quantity: item.quantity,
        }))
        const result = await db('orderdetail').insert(list)
        return result;
    },


  

    async getListOrder(email, orderState) {
        const orderWithState = await db('orders')
            .join('orderstatus', 'orderstatus.OrderID', 'orders.OrderID')
            .select()
            .where({
                'orders.email': email,
                'orderstatus.Status': orderState
            })
            .orderBy('orderstatus.time').as('orderWithState')
        const result = await db.from(orderWithState);
        return result[0] || null;
    },





}