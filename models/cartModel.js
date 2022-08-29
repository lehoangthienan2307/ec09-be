import db from '../utils/db.js'

export default {
    async deleteCart(email) {
        const result = await db('cartdetail').where({
            CartID: db('cart').where({
                email: email
            }).select('CartID')
        }).delete();

        return result;
    },

    async getCart(email) {
        const result = await db('cart').where({
            "cart.email": email,
        }).select();
        return result[0] || null;
    },

    async addToCart(email, proId, quantity) {
        const result = await db('cartdetail').insert({
            CartID: db('cart').where({
                email: email
            }).select('CartID'),
            ProID: proId,
            quantity: quantity
        })
        return result;
    },

    async updateCart(email, proId, quantity) {
        const result = await db('cartdetail').where({
            CartID: db('cart').where({
                email: email
            }).select('CartID'),
            ProID: proId,
        }).update({
            quantity: quantity
        })
        return result;
    },


    async deleteFromCart(email, proId) {
        const res= await db('cartdetail').where({
            CartID: db('cart').where({
                email: email
            }).select('CartID'),
            ProID: proId,
        }).delete();
       return res;
    },

    getNumberOfItems(cart) {
        let n = 0;
        for (const ci of cart) {
          n += ci.quantity;
        }
        return n;
      },


}