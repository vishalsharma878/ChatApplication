const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors')
const bodyparser = require('body-parser');

const sequelize = require('./utils/database');
const User = require('./models/user');
const Messages = require('./models/chat');
const Group = require('./models/group');
const Membership = require('./models/menbership');

const userRoute = require('./routes/user');
const chatRoute = require('./routes/chat');
const chat = require('./models/chat');

app.use(bodyparser.json());
app.use(cors());
app.use('/user', userRoute);
app.use('/chat', chatRoute);

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

