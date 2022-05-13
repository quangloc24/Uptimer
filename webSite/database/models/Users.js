const mongoose = require('mongoose');
const User = new mongoose.Schema({
  id: String,
  bots: {
    type: [Schema.Types.ObjectId],
    ref: 'Bots',
    default: []
  },
})
/* ============================================== */
/* ⭐ Azury Manager • Private • Server Manager ⭐ */
/* Coded by discord.gg/azury Copyrighted @ Azury  */
/* ============================================== */