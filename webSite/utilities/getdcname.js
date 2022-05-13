const BASE_URL = "https://api.discordz.xyz/discord/v1/user?id=";
const fetch = require("node-fetch");
async function getdcname(botid) {
 await fetch(BASE_URL + botid)
  .then((res) => res.json())
  .then((body) => console.log(body))
  .catch((e) => console.log(e));
}
module.exports = getdcname;
/* ============================================== */
/* ⭐ Azury Manager • Private • Server Manager ⭐ */
/* Coded by discord.gg/azury Copyrighted @ Azury  */
/* ============================================== */