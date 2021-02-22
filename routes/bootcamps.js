const express= require('express');
const {getBootcamp,
    getBootcamps,createBootcamp,
    updateBootcamp,deleteBootcamp,
     getBootcampsInRadius,bootcampPhotoUpload
    }= require('../controllers/bootcamps');

const bootcamp= require('../models/Bootcamp');    

// Include other resource routers
const courseRouter= require('./courses');
const Bootcamp = require('../models/Bootcamp');

const router= express.Router();

const advancedResults= require('../middleware/advancedResults');
const {protect,authorize}= require('../middleware/auth');

// Re-route into other resource routers

router.use('/:bootcampId/courses', courseRouter);



router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);
router.route('/').get(advancedResults(Bootcamp,'courses'),getBootcamps).post(protect,authorize('publisher','admin'), createBootcamp);
router.route('/:id').get(getBootcamp).put(protect,authorize('publisher','admin'), updateBootcamp).delete(protect,authorize('publisher','admin'), deleteBootcamp);
router.route('/:id/photo').put(protect,authorize('publisher','admin'), bootcampPhotoUpload);

module.exports =router;