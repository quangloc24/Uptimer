const mongoose = require("mongoose");

const mongooseConnectionString = process.env.mongooseConnectionString || client.config.mongooseConnectionString;
if (!mongooseConnectionString) return;

mongoose.connect(mongooseConnectionString)
/* ============================================== */
/* ⭐ Azury Manager • Private • Server Manager ⭐ */
/* Coded by discord.gg/azury Copyrighted @ Azury  */
/* ============================================== */