import productModel from '../models/productModel.js'
import cartModel from '../models/cartModel.js'
import distance from 'google-distance';

export default {

    async getCart(req, res) {
        try {
            const  email  = req.user;
            const cart= await cartModel.getCart(email);
            const CartID= cart.CartID;
        
            const detailList = await productModel.getProductByCartID(CartID);
            const summaryItem= cartModel.getNumberOfItems(detailList);
            let total = 0;
            
            const items = [];
            for (const item of detailList) {

            const product = await productModel.findByProID(item.ProID);
            const amount = product.Price * item.quantity;
            total += amount;
              items.push({
                ProID: item.ProID,
                ProName: item.ProName,
                image: item.image,
                Price: item.Price,
                quantity: item.quantity,
                Amount: amount,
              })
            }

            res.status(200).send({
                message: "Get cart successfully",
                cart: {
                    CartID,
                    total: total,
                    summaryItem: summaryItem,
                    items
                },
            })
        } catch (err) {
            res.json({msg: err.message})
        }
    },




    async addToCart(req, res) {
        try {
            const  email  = req.user;
            const { ProID, quantity } = req.body;

            const cart = await cartModel.getCart(email);
            const { CartID} = cart;

            const detailList = await productModel.getProductByCartID(CartID);
            const listProID = detailList.map(item => ({
                ProID: item.ProID,
                quantity: item.quantity,
            }));

            const matchItem = listProID.filter(item => item.ProID === ProID)[0];
            if (matchItem) {
                await cartModel.updateCart(
                    email,
                    ProID,
                    quantity + matchItem.quantity
                );
                return res.status(200)
            }


            await cartModel.addToCart(email, ProID, quantity);
            return res.send({message:'added to cart '})
        } catch (err) {
            res.json({msg:err.message})
        }
    },

    async updateCart(req, res,next) {
        try {
            const email = req.user;
            const { ProID, quantity } = req.body;

            if (quantity < 1) {
                await cartModel.deleteFromCart(email, ProID);

                res.status(200).send({
                    message: "Delete successfully"
                })
            }

            const result = await cartModel.updateCart(email, ProID, quantity);
            if (result > 0) {
                res.status(200).send({
                    msg: "Update item of cart successfully"
                })
            } else {
                res.send({
                   msg: "Item not found"
                })
            }
        }
        catch (err) {
            next(err)
        }
        
    },

    async deleteProductFromCart(req, res) {
        try {
            const email = req.user;
            const { ProID } = req.body;

            const result = await cartModel.deleteFromCart(email, ProID);
            if (result > 0) {
                res.status(200).send({
                    exitcode: 0,
                    message: "Delete item of cart successfully"
                })
            } else {
                res.send({
                    exitcode: 102,
                    message: "Delete failed"
                })
            }
        } catch (err) {
            res.json({msg:err.message})
        }
    },



 
} 