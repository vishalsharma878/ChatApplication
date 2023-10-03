const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors')
const bodyparser = require('body-parser');

const userRoute = require('./routes/user');
const sequelize = require('./utils/database');
app.use(bodyparser.json());
app.use(cors());
app.use('/user', userRoute);

sequelize
   .sync()
   .then(() => {
    app.listen(3000);
   })
   .catch((err) => {
    console.log(err);
   });

