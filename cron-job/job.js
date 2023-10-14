const CronJob = require("cron").CronJob;
const sequelize = require("../utils/database");
const {Op} = require("sequelize");
const Chat = require("../models/chat");
const ArchivedChat = require("../models/archived-chat");

const job = new CronJob("0 4 * * *", function () {
  const now = new Date();
  now.setDate(now.getDate() - 1); // Subtract one day

  Chat.findAll({
    where: {
      createdAt: {
        [Op.lt]: now,
      },
    },
  }).then((chats) => {
    ArchivedChat.bulkCreate(chats).then(() => {
      Chat.destroy({
        where: {
          createdAt: {
            [Op.lt]: now,
          },
        },
      });
    });
  });
});

module.exports = job;