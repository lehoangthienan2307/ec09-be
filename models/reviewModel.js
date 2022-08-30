import db from '../utils/db.js'


export default {
    async createReview({email,ProID, rating, comment }) {
        const result = await db('rating').insert({
            email:email,
            ProID: ProID,
            rating: rating,
            comment: comment
        })
        return result
    },

    async getReview({ ProID}) {
      
        const result = await db('rating')
            .join('product', 'rating.ProID', 'product.ProID')
            .join('user', 'user.email', 'rating.email')
            .where({
                "product.ProID": ProID,
            })
            .select(
                'user.email',
                'user.name',
                'rating.ProID',
                'rating.rating',
                'rating.comment',
                'rating.time'
            )
        return result
    }
}