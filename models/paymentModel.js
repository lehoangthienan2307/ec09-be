import db from '../utils/db.js'

export default {
    async getPayment() {
        const result = await db('payment').select(
            'PaymentID',
            'method'
        )
        return result;
    },

    async getById(paymentId) {
        const result = await db('payment').where({
            'PaymentID': paymentId
        }).select(
            'PaymentID',
            'method'
        )
        return result[0] || null;
    }
}