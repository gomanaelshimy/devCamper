const mongoose= require('mongoose');
const CourseSchema= new mongoose.Schema ({
    title:{
    type: String,
    trim: true,
    required: [true, 'please add a course title']
},
    description:{
    type: String,
    required: [true,'please add a description']

    },
    weeks:{
        type: String,
        required: [true,'please add number of Weeks']
    
        },
    tuition:{
    type: String,
    required: [true,'please add tuition cost']
        
            },
    minimumSkill:{
    type: String,
    required: [true,'please add a minimum skill'],
    enum: ['beginner','intermediate','advanced'],
            
        },
    scholarshipAvailble:{
    type: Boolean,
    default: false
        
            },

     createdAt:{
     type: Date,
     deafault: Date.now
            
                },
    bootcamp: {
        type: mongoose.Schema.ObjectId,
        ref: 'Bootcamp',
        required: true
    }

});

module.exports= mongoose.model('Course', CourseSchema);