const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");
const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;

module.exports = {
  config: {
    name: "help",
    version: "1.18",
    author: "ShAn", 
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "View command usage",
    },
    longDescription: {
      en: "View command usage and list all commands or commands by category",
    },
    category: "info",
    guide: {
      en: "{pn} / help cmdName\n{pn} -c <categoryName>",
    },
    priority: 1,
  },

  onStart: async function ({ message, args, event, threadsData, role }) {
    const { threadID } = event;
    const threadData = await threadsData.get(threadID);
    const prefix = getPrefix(threadID);

    if (args.length === 0) {
      const categories = {};
      let msg = "";

      msg += `\n❦︎𝕋𝕙𝕖 𝕝𝕚𝕤𝕥 𝕠𝕗 𝕞𝕚𝕞𝕚'𝕤 𝕔𝕠𝕞𝕞𝕒𝕟𝕕❣︎\n`;

      for (const [name, value] of commands) {
        if (value.config.role > 1 && role < value.config.role) continue;

        const category = value.config.category || "Uncategorized";
        categories[category] = categories[category] || { commands: [] };
        categories[category].commands.push(name);
      }

      Object.keys(categories).forEach((category) => {
        if (category !== "info") {
          msg += `\n᯽༄-----------༄᯽\n│『 ${category.toUpperCase()} 』`;

          const names = categories[category].commands.sort();
          names.forEach((item) => {
            msg += `\n│ఌ︎${item}ఌ︎`;
          });

          msg += `\n𖣘------------♪`;
        }
      });

      const totalCommands = commands.size;
      msg += `\n𝑪𝒖𝒓𝒓𝒏𝒆𝒕𝒍𝒚 𝒕𝒉𝒆 𝒃𝒐𝒕 𝒉𝒂𝒔 ${totalCommands} 𝒄𝒐𝒎𝒎𝒂𝒏𝒅𝒔 𝒕𝒉𝒂𝒕 𝒄𝒂𝒏 𝒃𝒆 𝒖𝒔𝒆\n`;
      msg += `\n𝑻𝒚𝒑𝒆 ${prefix}𝒉𝒆𝒍𝒑 𝒄𝒐𝒎𝒎𝒂𝒏𝒅 𝒏𝒂𝒎𝒆 𝒕𝒐 𝒗𝒊𝒆𝒘 𝒕𝒉𝒆 𝒅𝒆𝒕𝒂𝒊𝒍𝒔 𝒐𝒇 𝒕𝒉𝒂𝒕 𝒄𝒐𝒎𝒎𝒂𝒏𝒅\n`;
      msg += `\n𖤍𝑩𝑶𝑻 𝑵𝑨𝑴𝑬 𖤍: 𝙈𝙞𝙢𝙞`;
      msg += `\n༆𝑩𝑶𝑻 𝑶𝑾𝑵𝑬𝑹༆`;
      msg += `\n 	 					`;
      msg += `\n~𝑵𝑨𝑴𝑬: ✯𝚂𝙷𝚄𝚅𝙾✯`;
      msg += `\n~𝑭𝑩:https://www.facebook.com/Facebookusers.2018`;

      await message.reply({
        body: msg,
      });
    } else if (args[0] === "-c") {
      if (!args[1]) {
        await message.reply("Please specify a category name.");
        return;
      }

      const categoryName = args[1].toLowerCase();
      const filteredCommands = Array.from(commands.values()).filter(
        (cmd) => cmd.config.category?.toLowerCase() === categoryName
      );

      if (filteredCommands.length === 0) {
        await message.reply(`No commands found in the category "${categoryName}".`);
        return;
      }

      let msg = `✯༄----------------\n✯ ${categoryName.toUpperCase()} COMMANDS 🔹\n╚══════════════╝\n`;

      filteredCommands.forEach((cmd) => {
        msg += `\n༆ ${cmd.config.name} ༆`;
      });

      await message.reply(msg);
    } else {
      const commandName = args[0].toLowerCase();
      const command = commands.get(commandName) || commands.get(aliases.get(commandName));

      if (!command) {
        await message.reply(`Command "${commandName}" not found.`);
      } else {
        const configCommand = command.config;
        const roleText = roleTextToString(configCommand.role);
        const author = configCommand.author || "Unknown";

        const longDescription = configCommand.longDescription
          ? configCommand.longDescription.en || "No description"
          : "No description";

        const guideBody = configCommand.guide?.en || "No guide available.";
        const usage = guideBody.replace(/{p}/g, prefix).replace(/{n}/g, configCommand.name);

        const response = `༆-- 𝑵𝒂𝒎𝒆--༆\n` +
          `│ ${configCommand.name}\n` +
          `├── INFO\n` +
          `│ Description: ${longDescription}\n` +
          `│ Other names: ${configCommand.aliases ? configCommand.aliases.join(", ") : "Do not have"}\n` +
          `│ Version: ${configCommand.version || "1.0"}\n` +
          `│ Role: ${roleText}\n` +
          `│ Time per command: ${configCommand.countDown || 1}s\n` +
          `│ Author: ${author}\n` +
          `├── Usage\n` +
          `│ ${usage}\n` +
          `├── Notes\n` +
          `│ The content inside <ShAn> can be changed\n` +
          `│ The content inside [a|b|c] is a or b or c\n` +
          `╰━━━━━━━❖`;

        await message.reply(response);
      }
    }
  },
};

function roleTextToString(roleText) {
  switch (roleText) {
    case 0:
      return "0 (All users)";
    case 1:
      return "1 (Group administrators)";
    case 2:
      return "2 (Admin bot)";
    default:
      return "Unknown role";
  }
    }
