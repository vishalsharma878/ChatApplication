const express = require('express');
const app = express();
require('dotenv').config();
const fs = require('fs');
const cors = require('cors')
const bodyparser = require('body-parser');
const helmet = require('helmet');
const morgan = require('morgan');

const sequelize = require('./utils/database');
const User = require('./models/user');
const Messages = require('./models/chat');
const Group = require('./models/group');
const Membership = require('./models/menbership');

const userRoute = require('./routes/user');
const chatRoute = require('./routes/chat');
const groupRoute = require('./routes/group-users');
const chat = require('./models/chat');

const accessLogStream = fs.createWriteStream('access.log', {flags: 'a'});

app.use(helmet());
app.use(morgan('combined', { stream: accessLogStream }));
app.use(bodyparser.json());
app.use(cors());
app.use('/user', userRoute);
app.use('/chat', chatRoute);
app.use(groupRoute);

User.hasMany(Messages);
Messages.belongsTo(User);

Group.hasMany(Messages);
Messages.belongsTo(Group);

User.belongsToMany(Group, { through: Membership });
Group.belongsToMany(User, { through: Membership });

sequelize
   .sync()
   .then(() => {
    app.listen(3000);
   })
   .catch((err) => {
    console.log(err);
   });

