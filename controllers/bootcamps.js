const ErrorResponse= require('../utils/errorResponse');
const asyncHandler= require('../middleware/async');
const Bootcamp= require('../models/Bootcamp');

//@description Get all bootcamps
//@route Get /api/v1/bootcamps
//@access Public

exports.getBootcamps= asyncHandler(async (req,res,next)=>{

    const bootcamps= await Bootcamp.find();
    res.status(200).json({
        sucess: true, count:bootcamps.length, data: bootcamps
    });

});

//@description Get a bootcamp
//@route Get /api/v1/bootcamps/:id
//@access Public

exports.getBootcamp=  asyncHandler(async (req,res,next)=>{
    
        const bootcamp= await Bootcamp.findById(req.params.id);
    if(!bootcamp){
        return next(
        next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
        )
        );
    }
        res.status(200).json({
        sucess: true, data: bootcamp
    });
   
});
//@description create a bootcamp
//@route Post /api/v1/bootcamps
//@access Public

exports.createBootcamp=  asyncHandler(async (req,res,next)=>{
   
        const bootcamp= await Bootcamp.create(req.body);
        res.status(201).json({ success: true, data: bootcamp
        });
   
   
});

//@description update a bootcamp
//@route Put /api/v1/bootcamps/:id
//@access Public

exports.updateBootcamp=  asyncHandler(async (req,res,next)=>{

    const bootcamp=await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators:true
    });

    if(!bootcamp){
        return next(
            next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
            )
            );    }
    res.status(200).json({success:true, data: bootcamp});

});
//@description Delete a bootcamp
//@route Delete /api/v1/bootcamps/:id
//@access Public

exports.deleteBootcamp=  asyncHandler(async (req,res,next)=>{
    
        const bootcamp= await Bootcamp.findByIdAndDelete(req.params.id);
    
        if(!bootcamp){
            return next(
                next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
                )
                );        }
        res.status(200).json({success:true, data: {}});
    
});
