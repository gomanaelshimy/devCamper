const ErrorResponse= require('../utils/errorResponse');
const asyncHandler= require('../middleware/async');
const Course= require('../models/Course');
const Bootcamp = require('../models/Bootcamp');

//@description Get all courses
//@route Get /api/v1/courses
//@route Get /api/v1/bootcamps/:bootcampId/courses
//@access Public

exports.getCourses= asyncHandler(async (req, res, next) =>{
    let query;
    if (req.params.bootcampId){
        const courses= await Course.find ({bootcamp: req.params.bootcampId});
    return res.status(200).json({
        sucess:true,
        count: courses.length,
        data:courses
    });

    }else {
      res.status(200).json(res.advancedResults);
    }
});

//@description Get a course
//@route Get /api/v1/courses/:id
//@access Public

exports.getCourse=  asyncHandler(async (req,res,next)=>{
    
const course = await Course.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description'
});
if(!course){
    return next(new ErrorResponse(`no course with the id of ${req.params.id}`),404);
}
    res.status(200).json({
    sucess: true,
    data: course
});

});


//@description Add a course
//@route Post /api/v1/bootcamps/:bootcampId/courses
//@access Private

exports.addCourse=  asyncHandler (async (req,res,next)=>{
    req.body.bootcamp= req.params.bootcampId;  
    const bootcamp = await Bootcamp.findById(req.params.bootcampId);
    if(!bootcamp){
        return next(new ErrorResponse(`no bootcamp with the id of ${req.params.bootcampId}`),404);
    }
    const course= await Course.create(req.body);
    res.status(200).json({
        sucess: true,
        data: course
    });

});

//@description Update a course
//@route Put /api/v1/courses/:id
//@access Private

exports.updateCourse=  asyncHandler (async (req,res,next)=>{
    let course = await Course.findById(req.params.id);
    if(!course){
        return next(
            new ErrorResponse(`no course with the id of ${req.params.id}`),404);
    }
course = await Course.findByIdAndUpdate(req.params.id, req.body,{
    new:true,
    runValidators: true
});
    res.status(200).json({
        sucess: true,
        data: course
    });

});

//@description Delete a course
//@route Delete /api/v1/courses/:id
//@access Private

exports.deleteCourse=  asyncHandler (async (req,res,next)=>{
    const course = await Course.findById(req.params.id);
    if(!course){
        return next(
            new ErrorResponse(`no course with the id of ${req.params.id}`),404);
    }
await course.remove();
    res.status(200).json({
        sucess: true,
        data: {}
    });

});


