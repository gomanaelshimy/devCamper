const express= require('express');
const {getBootcamp,
    getBootcamps,createBootcamp,
    updateBootcamp,deleteBootcamp,
     getBootcampsInRadius,bootcampPhotoUpload
    }= require('../controllers/bootcamps');

const bootcamp= require('../models/Bootcamp');    
const advancedResults= require('../middleware/advancedResults');

// Include other resource routers
const courseRouter= require('./courses');
const Bootcamp = require('../models/Bootcamp');

const router= express.Router();

const {protect}= require('../middleware/auth');

// Re-route into other resource routers

router.use('/:bootcampId/courses', courseRouter);



router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);
router.route('/').get(advancedResults(Bootcamp,'courses'),getBootcamps).post(protect, createBootcamp);
router.route('/:id').get(getBootcamp).put(protect, updateBootcamp).delete(protect, deleteBootcamp);
router.route('/:id/photo').put(protect, bootcampPhotoUpload);

module.exports =router;