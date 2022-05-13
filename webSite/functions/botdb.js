const DB = require('../database/models/Bots')

const savedb = async(owner, bot, path, expire) => {
  await DB.create({
    owner: owner,
    bot: bot,
    path: path,
    expire: expire
  })
}

module.exports = savedb;
/* ============================================== */
/* ⭐ Azury Manager • Private • Server Manager ⭐ */
/* Coded by discord.gg/azury Copyrighted @ Azury  */
/* ============================================== */