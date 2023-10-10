const express = require('express');
const app = express();
const http = require('http');
const socketIo = require('socket.io');
const server = http.createServer(app);
require('dotenv').config();
const fs = require('fs');
const cors = require('cors');
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
const accessLogStream = fs.createWriteStream('access.log', {flags: 'a'});

app.use(helmet());
app.use(morgan('combined', { stream: accessLogStream }));
app.use(bodyparser.json());
app.use(cors());

const io = socketIo(server,  {
  cors: {
    origin: ['http://127.0.0.1:5500'],
  },
});
io.on('connection', socket => {
   socket.on('chatMessage', messages => {
     io.emit('newChatMessage', messages)
   })
})

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
    server.listen(3000);
   })
   .catch((err) => {
    console.log(err);
   });

