const fs= require('fs');
const mongoose= require('mongoose');
const colors= require('colors');
const dotenv= require('dotenv');

//load env vars
dotenv.config({path: './config/config.env'});

//Load models

const Bootcamp= require('./models/Bootcamp');
const Course= require('./models/Course');
const User= require('./models/User');
const Review = require('./models/Review');

//connect to DB

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});

//Read JSON files
const bootcamps= JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`,'utf-8'));
const courses= JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`,'utf-8'));
const users= JSON.parse(fs.readFileSync(`${__dirname}/_data/users.json`,'utf-8'));
const reviews= JSON.parse(fs.readFileSync(`${__dirname}/_data/reviews.json`,'utf-8'));



//Import into DB

const importData= async()=>{
    try{
        await Bootcamp.create(bootcamps);
        await Course.create(courses);
        await User.create(users);
        await Review.create(reviews);

        console.log('Data Imported...'.green.inverse);
  process.exit();
    }catch(err){
console.error(err);
    }
}

//Delete Data

const deleteData= async()=>{
    try{
        await Bootcamp.deleteMany();
        await Course.deleteMany();
        await User.deleteMany();
        await Review.deleteMany();

        console.log('Data Destroyed...'.red.inverse);
  process.exit();
    }catch(err){
console.error(err);
    }
}

if(process.argv[2]=== '-i'){
importData();
}else if (process.argv[2]=== '-d'){
deleteData();
}

/*NODE_ENV=development
PORT=5000

MONGO_URI=

GEOCODER_PROVIDER=mapquest
GEOCODER_API_KEY=

FILE_UPLOAD_PATH= ./public/uploads
MAX_FILE_UPLOAD= 1000000

JWT_SECRET=
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30

SMTP_HOST= "smtp.mailtrap.io"
SMTP_PORT= 2525
SMTP_EMAIL= 
SMTP_PASSWORD= 
FROM_EMAIL= 
FROM_NAME= */