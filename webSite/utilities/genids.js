function genids(len) {
 let res = "";
 const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz01234567890";
 for (i = 0; i < len; i++) {
  res += characters.charAt(Math.floor(Math.random() * characters.length));
 }
 return res;
}
module.exports = genids;
/* ============================================== */
/* ⭐ Azury Manager • Private • Server Manager ⭐ */
/* Coded by discord.gg/azury Copyrighted @ Azury  */
/* ============================================== */