const { Client, MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");
const colors = require(`colors`);
const UrlsConfig = require("./database/models/UrlsConfig");

/**
 * Fetch Projects
 * @param {string[]} projects
 * @param {Client} client
 */
module.exports = async (projects, client) => {
  projects.forEach(async (url) => {
    let doc = await UrlsConfig.findOne({
      projectURL: url,
    });

    let pinged = doc.get("pinged");
    let author = doc.get("authorID");

    let errors = false;
    try {
      await fetch(url);
    } catch (e) {
      errors = true;

      let embed = new MessageEmbed()
        .setTitle(`Unable to fetch a URL!`)
        .setColor("#2990ff")
        .addField("Url", url)
        .addField("Author", author)
        .addField("Error", `${e.name}\n\n${e.message}`);

      await UrlsConfig.findOneAndUpdate(
        { projectURL: url },
        {
          error: true,
          errorText: e.message,
        },
        { new: true }
      );


    } finally {
      if (!errors) {
        pinged++;
        
  console.log(`[🟢] :: Pinged a URL!`.brightGreen.bold)
        await UrlsConfig.findOneAndUpdate(
          { projectURL: url },
          {
            error: false,
            pinged,
          },
          { new: true }
        );
      }
    }
  });
};