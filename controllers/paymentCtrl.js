import paymentModel from '../models/paymentModel.js'
import userModel from '../models/userModel.js'
import productModel from '../models/productModel.js'


export const paymentCtrl = {
    createPayment: async(req, res) => {
        try {
            const user = await userModel.findByEmail(req.user)
            if(!user) return res.status(400).json({msg: "User does not exist."})

        

            const {name, email} = user;

            const newPayment = {
                 name, email
            }
            await paymentModel.addPayment(newPayment)
            
            res.json({msg: "Payment Succes!"})
            
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    }
}

