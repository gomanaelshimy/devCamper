const express= require ('express');
const dotenv= require('dotenv');
const morgan= require('morgan');
const colors= require('colors');
const errorHandler= require('./middleware/error');
const connectDB= require('./config/db')

//load environment variables
dotenv.config({ path: './config/config.env'});

// connect to database
connectDB();

//route files
const bootcamps= require('./routes/bootcamps');

const app = express();

// Body parser
app.use(express.json());

// Dev logging middleware
if(process.env.Node_ENV === 'development'){
    app.use(morgan('dev'));
}

//mount routers
app.use('/api/v1/bootcamps',bootcamps);

app.use(errorHandler);

const PORT= process.env.PORT || 5000;

const server= app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold));

//handle unhandled promise rejections
process.on('unhandledRejection',(err,Promise)=> {
    console.log(`Error: ${err.message}`.red);
// Close server & exit process
 server.close(()=> process.exit(1))
});