const Schema = require('../database/models/Bots')

const saveDb = async (customerId, days) => {
  await Schema.create({
    OwnerId: customerId,
    Expire: days
  })
}
module.exports = saveDb;
/* ============================================== */
/* ⭐ Azury Manager • Private • Server Manager ⭐ */
/* Coded by discord.gg/azury Copyrighted @ Azury  */
/* ============================================== */