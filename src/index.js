const express = require('express');
const app = express();
const morgan=require('morgan');
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URL).catch((ex) => console.error('Error connecting to database...', { ex }));

mongoose.connection.on('error', (error) => {
    console.log(error)
})

mongoose.connection.once('connected', () => {
    console.log('Database Connected');
})
//Configuraciones
app.set('port', process.env.PORT || 3000);
app.set('json spaces', 2)
 
//Middleware
app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}));
app.use(express.json());
 
//Routes
app.use(require('./routes/index'));
 
//Iniciando el servidor
app.listen(app.get('port'),()=>{
    console.log(`Server listening on port ${app.get('port')}`);
});