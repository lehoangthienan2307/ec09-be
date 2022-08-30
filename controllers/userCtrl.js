import userModel from '../models/userModel.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import {sendEmail} from './sendMail.js'
import constants from '../config/constants.js'
import {google} from 'googleapis'
const {OAuth2} = google.auth
import moment from "moment";

const client = new OAuth2(process.env.MAILING_SERVICE_CLIENT_ID)

const {CLIENT_URL} = process.env


export const userCtrl = {
    register: async (req, res) => {
        try {
            const {name, email, password,address,  phone, dob} = req.body
            
            if(!name || !email || !password || !address|| !phone || !dob)
                return res.status(400).json({msg: "Please fill in all fields."})

            if(!validateEmail(email))
                return res.status(400).json({msg: "Invalid emails."})

            const user = await userModel.findByEmail(email)
            if(user) return res.status(400).json({msg: "This email already exists."})

            if(password.length < 6)
                return res.status(400).json({msg: "Password must be at least 6 characters."})

            const passwordHash = await bcrypt.hash(password, 12)
            const dayOfBirth = moment(req.body.dob, 'DD/MM/YYYY').format('YYYY-MM-DD');
            const newUser = {
                name: req.body.name,
                address: req.body.address,
                email: req.body.email,
                role: 0,
                password: passwordHash,
                phone: req.body.phone,
                dob: dayOfBirth
            }
           

            const activation_token = createActivationToken(newUser)

            const url = `${CLIENT_URL}/auth/activate/${activation_token}`
            sendEmail(email, url, "Verify your email address")
           
            res.json({msg: "Register Success! Please activate your email to start."})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    activateEmail: async (req, res) => {
        try {
            const {activation_token} = req.body
            const user = jwt.verify(activation_token, process.env.ACTIVATION_TOKEN_SECRET)

            const {name, email, password,address,  phone,dob} = user

            const check = await userModel.findByEmail(email)
            if(check) return res.status(400).json({msg:"This email already exists."})

            const newUser ={
                name,
                address,
                email,
                role: 0,
                password,
                phone, 
                dob
            }
        

            await userModel.addAccount(newUser)
            res.json({msg: "Account has been activated!"})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    login: async (req, res) => {
        try {
            const {email, password} = req.body
            const user = await userModel.findByEmail(email)
            if(!user) return res.status(400).json({msg: "This email does not exist."})

            const isMatch = await bcrypt.compare(password, user.password)
            if(!isMatch) return res.status(400).json({msg: "Password is incorrect."})

         
            const access_token= createAccessToken(email)

            res.json({msg: "Login success!", access_token})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

 
    forgotPassword: async (req, res) => {
        try {
            const {email} = req.body
            const user = await userModel.findByEmail(email)
            if(!user) return res.status(400).json({msg: "This email does not exist."})

            const access_token = createAccessToken(email)
            const url = `${CLIENT_URL}/auth/reset/${access_token}`

            sendEmail(email, url, "Reset your password")
            res.json({msg: "Re-send the password, please check your email."})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    resetPassword: async (req, res) => {
        try {
            const {password} = req.body
            const passwordHash = await bcrypt.hash(password, 12)
            const entity = {
                email: req.user,
                password: passwordHash
            }
            await userModel.updateInfoAccount(entity)

            res.json({msg: "Password successfully changed!"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    getUserInfor: async (req, res) => {
        try {
            const account = await userModel.findByEmail(req.user)
            
            res.status(200).send({
                account: account
            })
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

  
    googleLogin: async (req, res) => {
        try {
            const {tokenId} = req.body

            const verify = await client.verifyIdToken({idToken: tokenId, audience: process.env.MAILING_SERVICE_CLIENT_ID})
            
            const {email_verified, email, name} = verify.payload

            const password = email + process.env.GOOGLE_SECRET

            const passwordHash = await bcrypt.hash(password, 12)

            if(!email_verified) return res.status(400).json({msg: "Email verification failed."})

            const user = await userModel.findByEmail(email)

            if(user){
               

                const refresh_token = createRefreshToken(email)
                res.cookie('refreshtoken', refresh_token, {
                    httpOnly: true,
                    path: '/auth/refresh_token',
                    maxAge: 7*24*60*60*1000 // 7 days
                })

                res.json({msg: "Login success!"})
            }else{
                const newUser = {
                    name, email, password: passwordHash
                }

              
                await userModel.addAccount(newUser)
                const access_token= createAccessToken(email)

                const refresh_token = createRefreshToken(email)
                res.cookie('refreshtoken', refresh_token, {
                    httpOnly: true,
                    path: '/auth/refresh_token',
                    maxAge: 7*24*60*60*1000 // 7 days
                })
                res.json({msg: "Login success!", access_token})
               
            }


        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    
 }

 function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

const createActivationToken = (payload) => {
    return jwt.sign(payload, process.env.ACTIVATION_TOKEN_SECRET, {expiresIn: '1d'})
}

const createAccessToken = (payload) => {
    return jwt.sign({payload}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1d' })
}

const createRefreshToken = (payload) => {
    return jwt.sign({payload}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '7d'})
}

