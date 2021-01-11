//@description Get all bootcamps
//@route Get /api/v1/bootcamps
//@access Public

exports.getBootcamps= (req,res,next)=>{
    res.status(200).json({Success: 'true', msg: 'show all bootcamps'});
}

//@description Get a bootcamp
//@route Get /api/v1/bootcamps/:id
//@access Public

exports.getBootcamp= (req,res,next)=>{
    res.status(200).json({Success: 'true', msg: 'get a bootcamp'});}

//@description create a bootcamp
//@route Post /api/v1/bootcamps
//@access Public

exports.createBootcamp= (req,res,next)=>{
    res.status(200).json({Success: 'true', msg: 'created a bootcamp'});
}
//@description update a bootcamp
//@route Put /api/v1/bootcamps/:id
//@access Public

exports.updateBootcamp= (req,res,next)=>{
    res.status(200).json({Success: 'true', msg: 'update a bootcamp'});
}
//@description Delete a bootcamp
//@route Delete /api/v1/bootcamps/:id
//@access Public

exports.deleteBootcamp= (req,res,next)=>{
    res.status(200).json({Success: 'true', msg: 'delete a bootcamp'});
}
