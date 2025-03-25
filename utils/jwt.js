import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

export const generateToken =(userId)=>{
    return jwt.sign({_id :userId}, process.env.TOKEN_SECRET)
}