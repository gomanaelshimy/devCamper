const mongoose= require('mongoose');
const ReviewSchema= new mongoose.Schema ({
    title:{
    type: String,
    trim: true,
    required: [true, 'please add a review title'],
    maxlength: 100
},
    text:{
    type: String,
    required: [true,'please add some text']

    },
    rating:{
        type: Number,
        min:1,
        mas:10,
        required: [true,'please add a rating between 1 and 10']
    
        },
     createdAt:{
     type: Date,
     deafault: Date.now
            
                },
    bootcamp: {
        type: mongoose.Schema.ObjectId,
        ref: 'Bootcamp',
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }

});


// prevent user from submitting more than one review per bootcamp
ReviewSchema.index({bootcamp: 1, user:1}, {unique:true});

//Static method to get average rating and save
ReviewSchema.statics.getAverageRating= async function(bootcampId){
    const obj= await this.aggregate([{
        $match: {bootcamp: bootcampId}
    },
    {
        $group:{
           _id: '$bootcamp',
           averageRating: { $avg: '$rating' }
        }
    }
    ]);
    
    try {
        await this.model('Bootcamp').findByIdAndUpdate(bootcampId,{
            averageRating: obj[0].averageRating
        })
    } catch (err) {
      console.error(err);  
    }
    };
    
    // call getAverageCost after  save
    
    ReviewSchema.post('save', function(){
    this.constructor.getAverageRating(this.bootcamp);
    });
    
    // call getAverageCost before remove
    
    ReviewSchema.pre('remove', function(){
        this.constructor.getAverageRating(this.bootcamp);
    
    });


module.exports= mongoose.model('Review', ReviewSchema);