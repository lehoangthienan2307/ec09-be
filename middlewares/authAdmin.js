import Users from '../models/userModel.js'

export const authAdmin = async (req, res, next) => {
    try {
        const user = await Users.findById(req.user.UserID)

        if(user.role !== 1) 
            return res.status(500).json({msg: "Admin resources access denied."})

        next()
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
}

