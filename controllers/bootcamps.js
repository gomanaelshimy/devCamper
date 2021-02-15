const ErrorResponse= require('../utils/errorResponse');
const asyncHandler= require('../middleware/async');
const geocoder=require('../utils/geocoder');
const Bootcamp= require('../models/Bootcamp');

//@description Get all bootcamps
//@route Get /api/v1/bootcamps
//@access Public

exports.getBootcamps= asyncHandler(async (req,res,next)=>{
    let query;

//copy req.query
    const reqQuery = {...req.query};
// fields to exclude
const removeFields= ['select','sort', 'page', 'limit'];
// Loop  over removeFields and delete them from reqQuery
removeFields.forEach(param =>delete reqQuery[param]);

//create query string
    let queryStr= JSON.stringify(reqQuery);
//create operators ($gt, $gte, etc)
    queryStr= queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g,match => `$${match}`);
//finding resource  ex. bootcamp
query= Bootcamp.find(JSON.parse(queryStr)).populate('courses');
//select fields
if(req.query.select){
    const fields= req.query.select.split(',').join(' ');
query= query.select(fields);
}
//sort
if(req.query.sort){
    const sortBy= req.query.sort.split(',').join(' ');
    query= query.sort(sortBy);
}else{
    query= query.sort('-createdAt');
}
//pagination
const page= parseInt(req.query.page,10)||1;
const limit= parseInt(req.query.limit,10)||25;
const startIndex= (page-1)*limit;
const endIndex=page*limit;
const total= await Bootcamp.countDocuments();

query= query.skip(startIndex).limit(limit);

//excuting query   
const bootcamps= await query;

//pagination result
const pagination={};
if(endIndex<total){
    pagination.next={
        page: page+1,
        limit
    }
}
if(startIndex>0){
    pagination.prev={
        page: page-1,
        limit
    }
}
    res.status(200).json({
        sucess: true, count:bootcamps.length,pagination, data: bootcamps
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
        sucess: true,
        data: bootcamp
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
//@access Private
exports.deleteBootcamp=  asyncHandler(async (req,res,next)=>{
    
    const bootcamp= await Bootcamp.findById(req.params.id);

    if(!bootcamp){
        return next(
            next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
            )
            );       
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

