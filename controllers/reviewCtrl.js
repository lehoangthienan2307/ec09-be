import reviewModel from '../models/reviewModel.js'


export default {
    async createReview(req, res, next) {
        try {
            const {
                OrderID,
                rating,
                comment
            } = req.body;
            const { email } = req.user;

            await reviewModel.createReview({
                email: email,
                OrderID: OrderID,
                rating: rating,
                comment: comment,
            });
            res.status(200).send({
                message: "Created product review "
            })
        } catch (err) {
            next(err)
        }
    },

    async getReview(req, res, next) {
        try {
            const ProID= 4;
            const result = await reviewModel.getReview({ProID});
            const reviews = result.map(review => ({
                email: review.email,
                name: review.name,
                ProID: review.ProID,
                rating: review.rating,
                comment: review.comment,
                createdTime: review.time
            }))
            res.status(200).send({
                message: "Get product review list",
                reviews: reviews
            })
        } catch (err) {
            next(err)
        }
    }
}