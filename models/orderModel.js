import db from '../utils/db.js'



export default {
    async getOrderById(id) {
        const result = await db('orders').where({
            'order.OrderID': orderId,
        })
            .join('payment', 'orders.PaymentID', 'payment.PaymentID')
            .select(
                'orders.OrderID',
                "orders.email",
                "orders.OrderDate",
                'orders.Status',
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
            .limit(1)
        return result[0] || null;
    },

    async getHistoryOrder(email, orderState, limit, offset ) {
      
        const result = await db('orders')
        .join('orderstatus','orderstatus.OrderID','order.OrderID')
        .where({'order.email':email})
        .limit(limit)
        .offset(offset)
        return result || null;
    },


    async createOrder(entity) {
        await db('orders').insert(entity)

        await db('orderstatus').insert({
            'OrderID': entity.OrderID
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
    }
}