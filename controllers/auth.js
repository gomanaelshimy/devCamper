const ErrorResponse= require('../utils/errorResponse');
const asyncHandler= require('../middleware/async');
const User= require('../models/User');

//@description Register user
//@route Get /api/v1/register
//@access Public
exports.register = asyncHandler(async(req,res,next)=>{
    const {name, email, password, role}= req.body;

    //create user
    const user= await User.create({
        name,
        email,
        password,
        role
    });
    res.status(200).json({success:true});
});