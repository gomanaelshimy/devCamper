const path= require('path');
const ErrorResponse= require('../utils/errorResponse');
const asyncHandler= require('../middleware/async');
const geocoder=require('../utils/geocoder');
const Bootcamp= require('../models/Bootcamp');

//@description Get all bootcamps
//@route Get /api/v1/bootcamps
//@access Public

exports.getBootcamps= asyncHandler(async (req,res,next)=>{

    res.status(200).json(res.advancedResults);

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
        sucess: true,
        data: bootcamp
    });
   
});
//@description create a bootcamp
//@route Post /api/v1/bootcamps
//@access Public

exports.createBootcamp=  asyncHandler(async (req,res,next)=>{
   //Add user to req.body
   req.body.user= req.user.id;
   //check for published bootcamp
   const publishedBootcamp= await Bootcamp.findOne({user:req.user.id});
   //if user is not an admin, they can add only one bootcamp
   if(publishedBootcamp&& req.user.role !== 'admin'){
return next(new ErrorResponse (`the User with ID ${req.user.id} has already published a bootcamp`, 400))
   }
        const bootcamp= await Bootcamp.create(req.body);
        res.status(201).json({ success: true, data: bootcamp
        });
   
   
});

//@description update a bootcamp
//@route Put /api/v1/bootcamps/:id
//@access Public

exports.updateBootcamp=  asyncHandler(async (req,res,next)=>{

    let bootcamp=await Bootcamp.findById(req.params.id);

    if(!bootcamp){
        return next(
            next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
            )
            );    }

    // make sure user is bootcamp owner
    if(bootcamp.user.toString()!== req.user.id && req.user.role !=='admin'){
     return   next(new ErrorResponse(`User ${req.params.id} is not authorized to update this bootcamp`, 401))
    }

    bootcamp= await Bootcamp.findByIdAndUpdate(req.params.id, req.body,{
        new: true,
        runValidators: true
    });

    res.status(200).json({success:true, data: bootcamp});

});



//@description Delete a bootcamp
//@route Delete /api/v1/bootcamps/:id
//@access Private
exports.deleteBootcamp=  asyncHandler(async (req,res,next)=>{
    
    const bootcamp= await Bootcamp.findById(req.params.id);

    if(!bootcamp){
        return next(
            new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
            
            );       
         }
    // make sure user is bootcamp owner
    if(bootcamp.user.toString()!== req.user.id && req.user.role !=='admin'){
        return next(new ErrorResponse(`User ${req.params.id} is not authorized to delete this bootcamp`, 401))
    }

    bootcamp.remove();
    res.status(200).json({success:true, data: {}});

});

//@description Get bootcamps within a radius
//@route Get /api/v1/radius/:zipcode/:distance
//@access Private

exports.getBootcampsInRadius=  asyncHandler(async (req,res,next)=>{
   const zipcode= req.params.zipcode;
   const distance= req.params.distance;

    //Get lat/lng from geocoder
const loc= await geocoder.geocode(zipcode);
const lat= loc[0].latitude;
const lng= loc[0].longitude;

// calc radius using radians
// divide distance by radius of earth
// earth radius = 3,963 mi/ 6,378 km

const radius = distance/ 3963;

const bootcamps= await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng,lat], radius]}}
});
   res.status(200).json({success: true, count: bootcamps.length, data: bootcamps}); 
});


//@description Upload photo for a bootcamp
//@route PUT /api/v1/bootcamps/:id/photo
//@access Private
exports.bootcampPhotoUpload=  asyncHandler(async (req,res,next)=>{
    
    const bootcamp= await Bootcamp.findById(req.params.id);

    if(!bootcamp){
        return next(
            next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
            )
            );       
         }
    // make sure user is bootcamp owner
    if(bootcamp.user.toString()!== req.user.id && req.user.role !=='admin'){
       return next(new ErrorResponse(`User ${req.params.id} is not authorized to update this bootcamp`, 401))
    }

   if(!req.files){
       return next( new ErrorResponse(`Please upload a file`, 400)
       )
   }

const file= req.files.file;

//Make sure the image is a photo

if(!file.mimetype.startsWith('image')){
    return next(new ErrorResponse(`please upload an image file`,400));
}

//check filesize
if(file.size > process.env.Max_File_Upload) {
    return next(
        new ErrorResponse(
            `please upload an image less than ${procees.env.Max_File_Upload}`,400)
        );
}

//Custom filename
file.name= ` photo_${bootcamp._id}${path.parse(file.name).ext}`;

//To Move the photo to the folder I want in the directory
file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err =>{
    if(err){
        console.error(err);
        return next(new ErrorResponse(`Problem with file upload`, 500));
    }
    await Bootcamp.findByIdAndUpdate(req.params.id, {photo: file.name});

res.status(200).json({
    success:true,
    data: file.name
});

});        
});
