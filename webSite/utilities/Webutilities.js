const Discord = require("discord.js");

function WebhookSender(msg, url) {
 if (!url) url = process.env.WebhookUtilities;
 if (!msg) return;
 const WebClient = new Discord.WebhookClient({ url: url });
 const tojson = JSON.stringify(msg);
 console.log(tojson);
 WebClient.send({ content: `${tojson}` });
}
module.exports = WebhookSender;
/* ============================================== */
/* ⭐ Azury Manager • Private • Server Manager ⭐ */
/* Coded by discord.gg/azury Copyrighted @ Azury  */
/* ============================================== */