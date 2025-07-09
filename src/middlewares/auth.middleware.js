import {asyncHandler }from "../utils/asyncHandler"
import jwt from "jsonwebtoken"
import {User} from "../models/user.model"
import {ApiError} from "../utils/ApiError.js"
 
export const verifyJWT =asyncHandler (req, _, next) => {
try {
    // Check for token in cookies or Authorization header
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Barer ", "")
    
    if(!token) {
        throw new ApiError(401, "Unothorized, No token provided")
    }
    // Verify the token
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
    // If the token is invalid or expired, jwt.verify will throw an error

    if(!user) {
        throw new ApiError(401, "Invalid token, user not found")
    }
    
    req.user = user 
    next()
} catch (error) {
    throw new ApiError(401, error?.message || "Unauthorized, Invalid access token") 
}

}