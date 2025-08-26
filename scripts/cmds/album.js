(cmd install album.js const axios = require("axios");
const fs = require("fs");
const path = require("path");

const categoryConfig = {
  displayNames: [
    "𝐅𝐮𝐧𝐧𝐲 𝐕𝐢𝐝𝐞𝐨", "𝐈𝐬𝐥𝐚𝐦𝐢𝐜 𝐕𝐢𝐝𝐞𝐨", "𝐒𝐚𝐝 𝐕𝐢𝐝𝐞𝐨", "𝐀𝐧𝐢𝐦𝐞 𝐕𝐢𝐝𝐞𝐨", "𝐋𝐨𝐅𝐈 𝐕𝐢𝐝𝐞𝐨",
    "𝐀𝐭𝐭𝐢𝐭𝐮𝐝𝐞 𝐕𝐢𝐝𝐞𝐨", "𝐇𝐨𝐫𝐧𝐲 𝐕𝐢𝐝𝐞𝐨", "𝐂𝐨𝐮𝐩𝐥𝐞 𝐕𝐢𝐝𝐞𝐨", "𝐅𝐥𝐨𝐰𝐞𝐫 𝐕𝐢𝐝𝐞𝐨", "𝐁𝐢𝐤𝐞 & 𝐂𝐚𝐫 𝐕𝐢𝐝𝐞𝐨",
    "𝐋𝐨𝐯𝐞 𝐕𝐢𝐝𝐞𝐨", "𝐋𝐲𝐫𝐢𝐜𝐬 𝐕𝐢𝐝𝐞𝐨", "𝐂𝐚𝐭 𝐕𝐢𝐝𝐞𝐨", "𝟏𝟖+ 𝐕𝐢𝐝𝐞𝐨", "𝐅𝐫𝐞𝐞 𝐅𝐢𝐫𝐞 𝐕𝐢𝐝𝐞𝐨",
    "𝐅𝐨𝐨𝐭𝐛𝐚𝐥𝐥 𝐕𝐢𝐝𝐞𝐨", "𝐁𝐚𝐛𝐲 𝐕𝐢𝐝𝐞𝐨", "𝐅𝐫𝐢𝐞𝐧𝐝𝐬 𝐕𝐢𝐝𝐞𝐨", "𝐏𝐮𝐛𝐠 𝐯𝐢𝐝𝐞𝐨", "𝐀𝐞𝐬𝐭𝐡𝐞𝐭𝐢𝐜 𝐕𝐢𝐝𝐞𝐨",
    "𝐍𝐚𝐫𝐮𝐭𝐨 𝐕𝐢𝐝𝐞𝐨", "𝐃𝐫𝐚𝐠𝐨𝐧 𝐛𝐚𝐥𝐥 𝐕𝐢𝐝𝐞𝐨", "𝐁𝐥𝐞𝐚𝐜𝐋 𝐕𝐢𝐝𝐞𝐨", "𝐃𝐞𝐦𝐨𝐧 𝐬𝐲𝐥𝐞𝐫 𝐕𝐢𝐝𝐞𝐨", 
    "𝐉𝐮𝐣𝐮𝐭𝐬𝐮 𝐊𝐚𝐢𝐬𝐞𝐧 𝐯𝐢𝐝𝐞𝐨", "𝐒𝐨𝐥𝐨 𝐥𝐞𝐯𝐞𝐥𝐢𝐧𝐠 𝐕𝐢𝐝𝐞𝐨", "𝐓𝐨𝐤𝐲𝐨 𝐫𝐞𝐯𝐞𝐧𝐠𝐞𝐫 𝐕𝐢𝐝𝐞𝐨", 
    "𝐁𝐥𝐮𝐞 𝐥𝐨𝐜𝐤 𝐕𝐢𝐝𝐞𝐨", "𝐂𝐡𝐚𝐢𝐧𝐬𝐚𝐰 𝐦𝐚𝐧 𝐕𝐢𝐝𝐞𝐨", "𝐃𝐞𝐚𝐭𝐋 𝐧𝐨𝐭𝐞 𝐯𝐢𝐝𝐞𝐨", "𝐎𝐧𝐞 𝐏𝐢𝐞𝐜𝐞 𝐕𝐢𝐝𝐞𝐨", 
    "𝐀𝐭𝐭𝐚𝐜𝐤 𝐨𝐧 𝐓𝐢𝐭𝐚𝐧 𝐕𝐢𝐝𝐞𝐨", "𝐒𝐚𝐤𝐚𝐦𝐨𝐭𝐨 𝐃𝐚𝐲𝐬 𝐕𝐢𝐝𝐞𝐨", "𝐰𝐢𝐧𝐝 𝐛𝐫𝐞𝐚𝐤𝐞𝐫 𝐕𝐢𝐝𝐞𝐨", 
    "𝐎𝐧𝐞 𝐩𝐮𝐧𝐜𝐋 𝐦𝐚𝐧 𝐕𝐢𝐝𝐞𝐨", "𝐀𝐥𝐲𝐚 𝐑𝐮𝐬𝐬𝐢𝐚𝐧 𝐕𝐢𝐝𝐞𝐨", "𝐁𝐥𝐮𝐞 𝐛𝐨𝐱 𝐕𝐢𝐝𝐞𝐨", "𝐇𝐮𝐧𝐭𝐞𝐫 𝐱 𝐇𝐮𝐧𝐭𝐞𝐫 𝐕𝐢𝐝𝐞𝐨", 
    "𝐋𝐨𝐧𝐞𝐫 𝐥𝐢𝐟𝐞 𝐕𝐢𝐝𝐞𝐨", "𝐇𝐚𝐧𝐢𝐦𝐞 𝐕𝐢𝐝𝐞𝐨"
  ],
  realCategories: [
    "funny", "islamic", "sad", "anime", "lofi", "attitude", "horny", "couple",
    "flower", "bikecar", "love", "lyrics", "cat", "18+", "freefire",
    "football", "baby", "friend", "pubg", "aesthetic", "naruto", "dragon", "bleach", 
    "demon", "jjk", "solo", "tokyo", "bluelock", "cman", "deathnote", "onepiece", 
    "attack", "sakamoto", "wind", "onepman", "alya", "bluebox", "hunter", "loner", "hanime"
  ],
  captions: [
    "𝐇𝐞𝐫𝐞 𝐲𝐨𝐮𝐫 𝐅𝐮𝐧𝐧𝐲 𝐕𝐢𝐝𝐞𝐨 𝐁𝐚𝐛𝐲 <😺",
    "𝐇𝐞𝐫𝐞 𝐲𝐨𝐮𝐫 𝐈𝐬𝐥𝐚𝐦𝐢𝐜 𝐕𝐢𝐝𝐞𝐨 𝐁𝐚𝐛𝐲 <✨",
    "𝐇𝐞𝐫𝐞 𝐲𝐨𝐮𝐫 𝐒𝐚𝐝 𝐕𝐢𝐝𝐞𝐨 𝐁𝐚𝐏𝐲 <😢",
    "𝐇𝐞𝐫𝐞 𝐲𝐨𝐮𝐫 𝐀𝐧𝐢𝐦𝐞 𝐕𝐢𝐝𝐞𝐨 𝐁𝐚𝐛𝐲 <🌟",
    "𝐇𝐞𝐫𝐞 𝐲𝐨𝐮𝐫 𝐋𝐨𝐅𝐈 𝐕𝐢𝐝𝐞𝐨 𝐁𝐚𝐛𝐲 <🎶",
    "𝐇𝐞𝐫𝐞 𝐲𝐨𝐮𝐫 𝐀𝐭𝐭𝐢𝐭𝐮𝐝𝐞 𝐕𝐢𝐝𝐞𝐨 𝐁𝐚𝐛𝐲 <☠️",
    "𝐇𝐞𝐫𝐞 𝐲𝐨𝐮𝐫 𝐇𝐨𝐫𝐧𝐲 𝐕𝐢𝐝𝐞𝐨 𝐁𝐚𝐛𝐲 <🥵",
    "𝐇𝐞𝐫𝐞 𝐲𝐨𝐔𝐫 𝐂𝐨𝐮𝐩𝐥𝐞 𝐕𝐢𝐝𝐞𝐨 𝐁𝐚𝐛𝐲 <💑",
    "𝐇𝐞𝐫𝐞 𝐲𝐨𝐮𝐫 𝐅𝐥𝐨𝐰𝐞𝐫 𝐕𝐢𝐝𝐞𝐨 𝐁𝐚𝐛𝐲 <🌸",
    "𝐇𝐞𝐫𝐞 𝐲𝐨𝐮𝐫 𝐁𝐢𝐤𝐞 & 𝐂𝐚𝐫 𝐕𝐢𝐝𝐞𝐨 𝐁𝐚𝐛𝐲 <😘",
    "𝐇𝐞𝐫𝐞 𝐲𝐨𝐮𝐫 𝐋𝐨𝐯𝐞 𝐯𝐢𝐝𝐞𝐨 𝐁𝐚𝐛𝐲 <❤",
    "𝐇𝐞𝐫𝐞 𝐲𝐨𝐮𝐫 𝐋𝐲𝐫𝐢𝐜𝐬 𝐕𝐢𝐝𝐞𝐨 𝐁𝐚𝐛𝐲 <🎵",
    "𝐇𝐞𝐫𝐞 𝐲𝐨𝐮𝐫 𝐂𝐚𝐭 𝐕𝐢𝐝𝐞𝐨 𝐁𝐚𝐛𝐲 <🐱",
    "𝐇𝐞𝐫𝐞 𝐲𝐨𝐮𝐫 𝐈𝟖+ 𝐕𝐢𝐝𝐞𝐨 𝐁𝐚𝐛𝐲 <🥵",
    "𝐇𝐞𝐫𝐞 𝐲𝐨𝐮𝐫 𝐅𝐫𝐞𝐞 𝐅𝐢𝐫𝐞 𝐕𝐢𝐝𝐞𝐨 🔥",
    "𝐇𝐞𝐫𝐞 𝐲𝐨𝐮𝐫 𝐅𝐨𝐨𝐭𝐛𝐚𝐥𝐥 𝐕𝐢𝐝𝐞𝐨 𝐁𝐚𝐛𝐲 <⚽",
    "𝐇𝐞𝐫𝐞 𝐲𝐨𝐮𝐫 𝐁𝐚𝐛𝐲 𝐕𝐢𝐝𝐞𝐨 𝐁𝐚𝐛𝐲 <🐥",
    "𝐇𝐞𝐫𝐞 𝐲𝐨𝐮𝐫 𝐅𝐫𝐢𝐞𝐧𝐝𝐬 𝐕𝐢𝐝𝐞𝐨 𝐁𝐚𝐛𝐲 <👭",
    "𝐇𝐞𝐫𝐞 𝐲𝐨𝐮𝐫 𝐏𝐮𝐛𝐠 𝐕𝐢𝐝𝐞𝐨 𝐁𝐚𝐛𝐲 <🐥",
    "𝐇𝐞𝐫𝐞 𝐲𝐨𝐮𝐫 𝐀𝐞𝐬𝐭𝐡𝐞𝐭𝐢𝐜 𝐯𝐢𝐝𝐞𝐨 𝐁𝐚𝐛𝐲",
    "𝐇𝐞𝐫𝐞 𝐲𝐨𝐮𝐫 𝐍𝐚𝐫𝐮𝐭𝐨 𝐕𝐢𝐝𝐞𝐨 𝐁𝐚𝐛𝐲 <🌟",
    "𝐇𝐞𝐫𝐞 𝐲𝐨𝐮𝐫 𝐃𝐫𝐚𝐠𝐨𝐧 𝐛𝐚𝐥𝐥 𝐕𝐢𝐝𝐞𝐨 𝐁𝐚𝐛𝐲 <🌟",
    "𝐇𝐞𝐫𝐞 𝐲𝐨𝐮𝐫 𝐁𝐥𝐞𝐚𝐜𝐡 𝐕𝐢𝐝𝐞𝐨 𝐁𝐚𝐛𝐲 <🌟",
    "𝐇𝐞𝐫𝐞 𝐲𝐨𝐮𝐫 𝐃𝐞𝐦𝐨𝐧 𝐬𝐲𝐥𝐞𝐫 𝐁𝐚𝐛𝐲 <🌟",
    "𝐇𝐞𝐫𝐞 𝐲𝐨𝐮𝐫 𝐉𝐮𝐣𝐢𝐭𝐬𝐮 𝐊𝐚𝐢𝐬𝐞𝐧 𝐕𝐢𝐝𝐞𝐨 𝐁𝐚𝐛𝐲 <🌟",
    "𝐇𝐞𝐫𝐞 𝐲𝐨𝐮𝐫 𝐒𝐨𝐥𝐨 𝐥𝐞𝐯𝐞𝐥𝐢𝐧𝐠 𝐕𝐢𝐝𝐞𝐨 𝐁𝐚𝐛𝐲 <🌟",
    "𝐇𝐞𝐫𝐞 𝐲𝐨𝐮𝐫 𝐓𝐨𝐤𝐲𝐨 𝐫𝐞𝐯𝐞𝐧𝐠𝐞𝐫 𝐕𝐢𝐝𝐞𝐨 𝐁𝐚𝐛𝐲 <🌟",
    "𝐇𝐞𝐫𝐞 𝐲𝐨𝐮𝐫 𝐁𝐥𝐮𝐞 𝐥𝐨𝐜𝐤 𝐕𝐢𝐝𝐞𝐨 𝐁𝐚𝐛𝐲 <🌟",
    "𝐇𝐞𝐫𝐞 𝐲𝐨𝐮𝐫 𝐂𝐡𝐚𝐢𝐧𝐬𝐚𝐰 𝐦𝐚𝐧 𝐕𝐢𝐝𝐞𝐨 𝐁𝐚𝐛𝐲 <🌟",
    "𝐇𝐞𝐫𝐞 𝐲𝐨𝐮𝐫 𝐃𝐞𝐚𝐭𝐡 𝐧𝐨𝐭𝐞 𝐕𝐢𝐝𝐞𝐨 𝐁𝐚𝐛𝐲 <🌟",
    "𝐇𝐞𝐫𝐞 𝐲𝐨𝐮𝐫 𝐎𝐧𝐞 𝐏𝐢𝐞𝐜𝐞 𝐕𝐢𝐝𝐞𝐨 𝐁𝐚𝐛𝐲 <🌟",
    "𝐇𝐞𝐫𝐞 𝐲𝐨𝐮𝐫 𝐀𝐓𝐭𝐚𝐜𝐤 𝐨𝐧 𝐓𝐢𝐐𝐭𝐚𝐧 𝐕𝐢𝐝𝐞𝐨 𝐁𝐚𝐛𝐲 <🌟",
    "𝐇𝐞𝐫𝐞 𝐲𝐨𝐮𝐫 𝐒𝐚𝐤𝐚𝐦𝐨𝐭𝐨 𝐃𝐚𝐲𝐬 𝐕𝐢𝐝𝐞𝐨 𝐁𝐚𝐛𝐲 <🌟",
    "𝐇𝐞𝐫𝐞 𝐲𝐨𝐮𝐫 𝐰𝐢𝐧𝐝 𝐛𝐫𝐞𝐚𝐤𝐞𝐫 𝐕𝐢𝐝𝐞𝐨 𝐁𝐚𝐛𝐲 <🌟",
    "𝐇𝐞𝐫𝐞 𝐲𝐨𝐮𝐫 𝐎𝐧𝐞 𝐩𝐮𝐧𝐜𝐡 𝐦𝐚𝐧 𝐕𝐢𝐝𝐞𝐨 𝐁𝐚𝐛𝐲 <🌟",
    "𝐇𝐞𝐫𝐞 𝐲𝐨𝐮𝐫 𝐀𝐥𝐲𝐚 𝐑𝐮𝐬𝐬𝐢𝐚𝐧 𝐕𝐢𝐝𝐞𝐨 𝐁𝐚𝐛𝐲 <🌟",
    "𝐇𝐞𝐫𝐞 𝐲𝐨𝐮𝐫 𝐁𝐥𝐮𝐞 𝐛𝐨𝐱 𝐕𝐢𝐝𝐞𝐨 𝐁𝐚𝐛𝐲 <🌟",
    "𝐇𝐞𝐫𝐞 𝐲𝐨𝐮𝐫 𝐇𝐮𝐧𝐭𝐞𝐫 𝐱 𝐇𝐮𝐧𝐭𝐞𝐫 𝐕𝐢𝐝𝐞𝐨 𝐁𝐚𝐛𝐲 <🌟",
    "𝐇𝐞𝐫𝐞 𝐲𝐨𝐮𝐫 𝐋𝐨𝐧𝐞𝐫 𝐥𝐢𝐟𝐞 𝐕𝐢𝐝𝐞𝐨 𝐁𝐚𝐛𝐲 <🌟",
    "𝐇𝐞𝐫𝐞 𝐲𝐨𝐮𝐫 𝐇𝐚𝐧𝐢𝐦𝐞 𝐕𝐢𝐝𝐞𝐨 𝐁𝐚𝐛𝐲 <🌟"
  ]
};

const baseApiUrl = async () => {
  const { data } = await axios.get(
    "https://raw.githubusercontent.com/Sh4nDev/ShAn.s-Api/refs/heads/main/Api.json");
  return data.shan;
};

module.exports = { 
  config: { 
    name: "album", 
    version: "1.7", 
    role: 0, 
    author: "♡︎ 𝗦𝗵𝗔𝗻 ♡︎", 
    category: "media", 
    guide: { 
      en: "{p}{n} [page number] (e.g., {p}{n} 2 to view the next page)\n{p}{n} add [category] [URL] - Add a video to a category\n{p}{n} list - View total videos in each category",
    }, 
  },

  onStart: async function ({ api, event, args }) { 
    const apiUrl = await baseApiUrl();

    if (args[0] === "add") {
      if (!args[1]) {
        return api.sendMessage("❌ Please specify a category. Usage: !album add [category]", event.threadID, event.messageID);
      }

      const category = args[1].toLowerCase();

      if (event.messageReply && event.messageReply.attachments && event.messageReply.attachments.length > 0) {
        const attachment = event.messageReply.attachments[0];
        
        if (attachment.type !== "video") {
          return api.sendMessage("❌ Only video attachments are allowed.", event.threadID, event.messageID);
        }

        try {
          // Use POST request for Imgur upload as per your snippet
          const imgurApiUrl = `${await baseApiUrl()}/ShAn-imgur`;
          const imgurResponse = await axios.post(imgurApiUrl, {
            url: attachment.url
          });

          if (!imgurResponse.data || !imgurResponse.data.ShAn) {
            throw new Error('𝐈𝐧𝐯𝐚𝐥𝐢𝐝 𝐫𝐞𝐬𝐩𝐨𝐧𝐬𝐞 𝐟𝐫𝐨𝐦 𝐀𝐏𝐈...');
          }

          const imgurLink = imgurResponse.data.ShAn;

          // Add to album
          const uploadResponse = await axios.post(`${apiUrl}/ShAn-album-add`, {
            category,
            videoUrl: imgurLink,
          });

          return api.sendMessage(uploadResponse.data.message, event.threadID, event.messageID);
        } catch (error) {
          return api.sendMessage(`❌ Failed to upload video: ${error.message}`, event.threadID, event.messageID);
        }
      }

      if (!args[2]) {
        return api.sendMessage("❌ Please provide a video URL or reply to a video message.", event.threadID, event.messageID);
      }

      const videoUrl = args[2];
      try {
        const response = await axios.post(`${apiUrl}/ShAn-album-add`, {
          category,
          videoUrl,
        });

        return api.sendMessage(response.data.message, event.threadID, event.messageID);
      } catch (error) {
        return api.sendMessage(`❌ Error: ${error.response?.data?.error || error.message}`, event.threadID, event.messageID);
      }

    } else if (args[0] === "list") {
      try {
        const response = await axios.get(`${apiUrl}/ShAn-album-list`);
        api.sendMessage(response.data.message, event.threadID, event.messageID);
      } catch (error) {
        api.sendMessage(`❌ Error: ${error.message}`, event.threadID, event.messageID);
      }
    } else {
      const itemsPerPage = 10;
      const page = parseInt(args[0]) || 1;
      const totalPages = Math.ceil(categoryConfig.displayNames.length / itemsPerPage);

      if (page < 1 || page > totalPages) {
        return api.sendMessage(`❌ Invalid page! Please choose between 1 - ${totalPages}.`, event.threadID, event.messageID);
      }

      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const displayedCategories = categoryConfig.displayNames.slice(startIndex, endIndex);

      const message = `𝐀𝐯𝐚𝐢𝐥𝐚𝐛𝐥𝐞 𝐀𝐥𝐛𝐮𝐦 𝐕𝐢𝐝𝐞𝐨 𝐋𝐢𝐬𝐭 🎀\n` +
        "𐙚━━━━━━━━━━━━━━━━━━━━━ᡣ𐭩\n" +
        displayedCategories.map((option, index) => `${startIndex + index + 1}. ${option}`).join("\n") +
        "\n𐙚━━━━━━━━━━━━━━━━━━━━━ᡣ𐭩" +
        `\n♻ | 𝐏𝐚𝐠𝐞 [${page}/${totalPages}]<😘\nℹ | 𝐓𝐲𝐩𝐞 !album ${page + 1} - 𝐭𝐨 𝐬𝐞𝐞 𝐧𝐞𝐱𝐭 𝐩𝐚𝐠𝐞.`.repeat(page < totalPages);

      await api.sendMessage(message, event.threadID, (error, info) => {
        global.GoatBot.onReply.set(info.messageID, {
          commandName: this.config.name,
          type: "reply",
          messageID: info.messageID,
          author: event.senderID,
          page,
          startIndex,
          displayNames: categoryConfig.displayNames,
          realCategories: categoryConfig.realCategories,
          captions: categoryConfig.captions
        });
      }, event.messageID);
    }
  },

  onReply: async function ({ api, event, Reply }) {
    api.unsendMessage(Reply.messageID);

    const reply = parseInt(event.body);
    const index = reply - 1;

    if (isNaN(reply) || index < 0 || index >= Reply.realCategories.length) {
      return api.sendMessage("Please reply with a valid number from the list.", event.threadID, event.messageID);
    }

    const category = Reply.realCategories[index];
    const caption = Reply.captions[index];
    const apiUrl = await baseApiUrl();

    try {
      const response = await axios.get(`${apiUrl}/ShAn-album-videos-${category}`);

      if (!response.data.success) {
        return api.sendMessage(response.data.message, event.threadID, event.messageID);
      }

      const videoUrls = response.data.videos;
      if (!videoUrls || videoUrls.length === 0) {
        return api.sendMessage("❌ | 𝐍𝐨 𝐯𝐢𝐝𝐞𝐨𝐬 𝐟𝐨𝐮𝐧𝐝 𝐟𝐨𝐫 𝐭𝐡𝐢𝐬 𝐜𝐚𝐞𝐠𝐨𝐫𝐲.", event.threadID, event.messageID);
      }

      const randomVideoUrl = videoUrls[Math.floor(Math.random() * videoUrls.length)];
      const filePath = path.join(__dirname, "temp_video.mp4");

      // Download video
      const downloadFile = async (url, filePath) => {
        const response = await axios({
          url,
          method: "GET",
          responseType: "stream",
          headers: { 'User-Agent': 'Mozilla/5.0' }
        });

        return new Promise((resolve, reject) => {
          const writer = fs.createWriteStream(filePath);
          response.data.pipe(writer);
          writer.on("finish", resolve);
          writer.on("error", reject);
        });
      };

      try {
        await downloadFile(randomVideoUrl, filePath);
        api.sendMessage(
          { body: caption, attachment: fs.createReadStream(filePath) },
          event.threadID,
          () => fs.unlinkSync(filePath),
          event.messageID
        );
      } catch (error) {
        api.sendMessage("❌ | 𝐅𝐚𝐢𝐥𝐞𝐝 𝐭𝐨 𝐝𝐨𝐰𝐧𝐥𝐨𝐚𝐝 𝐭𝐡𝐞 𝐯𝐢𝐝𝐞𝐨.", event.threadID, event.messageID);
      }
    } catch (error) {
      api.sendMessage("❌ | Error while fetching video URLs from the API. Please check the API or try again later.", event.threadID, event.messageID);
    }
  }
};
  const message = "❤‍🩹 𝗖𝗵𝗼𝗼𝘀𝗲 𝗮𝗻 𝗼𝗽𝘁𝗶𝗼𝗻𝘀  <💝\n"+"✿━━━━━━━━━━━━━━━━━━━━━━━✿\n"+ albumOptions.map((option, index) => `${index + 1}. ${option} 📛`).join("\n")+"\n✿━━━━━━━━━━━━━━━━━━━━━━━✿";

  await api.sendMessage(message, event.threadID,(error, info) => {
  global.GoatBot.onReply.set(info.messageID, {
    commandName: this.config.name,
    type: 'reply',
    messageID: info.messageID,
    author: event.senderID,
    link: albumOptions
  })},event.messageID);
}
//onReply function added by asif 
//------------Video Add--------------//
const validCommands = ['cartoon', 'photo', 'lofi', 'sad', 'islamic','funny','horny','anime','love','baby','lyrics','sigma','photo'];
  { api.setMessageReaction("👀", event.messageID, (err) => {}, true);
  }
  if (args[0] === 'list'){
 try {
   const lRes = await axios.get(`https://zzxfh5-3000.csb.app/data?list=dipto`);
const data = lRes.data;
     api.sendMessage(`🖤 𝗧𝗼𝘁𝗮𝗹 𝘃𝗶𝗱𝗲𝗼 𝗮𝘃𝗮𝗶𝗹𝗮𝗯𝗹𝗲 𝗶𝗻 𝗮𝗹𝗯𝘂𝗺 🩵\n${data.data}`, event.threadID, event.messageID);
 } catch (error) {
api.sendMessage(`${error}`,event.threadID,event.messageID)
 }
  }
    if (!args[1] || !validCommands.includes(args[1])) return;
    if (!event.messageReply || !event.messageReply.attachments) return;
    const attachment = event.messageReply.attachments[0].url;
    const URL = attachment;
    let query;
    switch (args[1]) {
        case 'cartoon':
            query = 'addVideo';
            break;
        case 'photo':
            query = 'addPhoto';
            break;
        case 'lofi':
            query = 'addLofi';
            break;
        case 'sad':
            query = 'addSad';
            break;
        case 'funny':
            query = 'addFunny';
            break;
        case 'islamic':
            query = 'addIslamic';
            break;
        case 'horny':
            query = 'addHorny';
            break;
        case 'anime':
            query = 'addAnime';
            break;
        case 'love':
            query = 'addLove';
            break;
        case 'lyrics':
            query = 'addLyrics';
            break;
        case 'baby':
            query = 'addBaby';
            break;
        case 'photo':
            query = 'addPhoto';
            break;
        case 'sigma':
            query = 'addSigma';
            break;
        default:
            break;
    }
    try {
        const response = await axios.get(`https://d1p-imgur.onrender.com/dip?url=${encodeURIComponent(URL)}`);
        const imgurLink = response.data.data;
        const fileExtension = path.extname(imgurLink);
         let query2;
              if (fileExtension === '.jpg' || fileExtension === '.jpeg' || fileExtension === '.png') {query2 = 'addPhoto';} 
      else if (fileExtension === '.mp4') {
        query2 = query;} else {
                  api.sendMessage('Invalid file format.', event.threadID, event.messageID);
                  return;
              }
              const svRes = await axios.get(`https://zzxfh5-3000.csb.app/data?${query2}=${imgurLink}`);
      const data = svRes.data;
           //   console.log(data);
              api.sendMessage(`✅ | ${data.data}\n\n🔰 | ${data.data2}`, event.threadID, event.messageID);
          } catch (error) {console.error('Error:', error);api.sendMessage(`Failed to convert image.\n${error}`, event.threadID, event.messageID);
      }
      },
onReply: async function ({ api, event, Reply }) {
        api.unsendMessage(Reply.messageID);
        if (event.type == "message_reply") {
        const reply = parseInt(event.body);
        if (isNaN(reply)) {
    return api.sendMessage("Please reply with either 1 - 12", event.threadID, event.messageID);
  }
  let query;
  let cp;
  if (reply === 1) {
    query = "funny";
    cp = "𝗡𝗮𝘄 𝗕𝗮𝗯𝘆 𝗙𝘂𝗻𝗻𝘆 𝘃𝗶𝗱𝗲𝗼 <🤣";
  } else if (reply === 2) {
    query = "islamic";
    cp = "𝗡𝗮𝘄 𝗕𝗮𝗯𝘆 𝗜𝘀𝗹𝗮𝗺𝗶𝗰 𝘃𝗶𝗱𝗲𝗼 <😇";
  }else if (reply === 3) {
      query = "sad";
    cp = "𝗡𝗮𝘄 𝗕𝗮𝗯𝘆 𝗦𝗮𝗱 𝘃𝗶𝗱𝗲𝗼 <🥺";
    }else if (reply === 4) {
      query = "anime";
    cp = "𝗡𝗮𝘄 𝗕𝗮𝗯𝘆 𝗮𝗻𝗶𝗺 𝘃𝗶𝗱𝗲𝗼 <😘";
    }else if (reply === 5) {
      query = "video";
    cp = "𝗡𝗮𝘄 𝗕𝗮𝗯𝘆 𝗖𝗮𝗿𝘁𝗼𝗼𝗻 𝘃𝗶𝗱𝗲𝗼 <😇";
    }else if (reply === 6) {
      query = "lofi";
    cp = "𝗡𝗮𝘄 𝗕𝗮𝗯𝘆 𝗟𝗼𝗳𝗶 𝘃𝗶𝗱𝗲𝗼 <😇";
    }
    else if (reply === 7) {
    query = "horny";
    cp = "𝗡𝗮𝘄 𝗕𝗮𝗯𝘆 𝗛𝗼𝗿𝗻𝘆 𝘃𝗶𝗱𝗲𝗼 <🥵";
    }
    else if (reply === 8) {
    query = "love";
    cp = "𝗡𝗮𝘄 𝗕𝗮𝗯𝘆 𝗟𝗼𝘃𝗲 𝘃𝗶𝗱𝗲𝗼 <😍";
    }
    else if (reply === 9) {
    query = "baby";
    cp = "𝗡𝗮𝘄 𝗕𝗮𝗯𝘆 𝗖𝘂𝘁𝗲 𝗕𝗮𝗯𝘆 𝘃𝗶𝗱𝗲𝗼 <🧑‍🍼";
    }
    else if (reply === 10) {
    query = "sigma";
    cp = "𝗡𝗮𝘄 𝗕𝗮𝗯𝘆 𝗦𝗶𝗴𝗺𝗮 𝘃𝗶𝗱𝗲𝗼 <🐤";
    }
    else if (reply === 11) {
    query = "lyrics";
    cp = "𝗡𝗮𝘄 𝗕𝗮𝗯𝘆 𝗟𝘆𝗿𝗶𝗰𝘀 𝘃𝗶𝗱𝗲𝗼 <🥰";
    }
    else if (reply === 12) {
    query = "photo";
    cp = "𝗡𝗮𝘄 𝗕𝗮𝗯𝘆 𝗥𝗮𝗻𝗱𝗼𝗺 𝗣𝗵𝗼𝘁𝗼 <😙";
    }
  //console.log(query);
  try {
    const res = await axios.get(`https://zzxfh5-3000.csb.app/data?type=${query}`);
    const imgUrl = res.data.data;
    const imgRes = await axios.get(imgUrl, { responseType: 'arraybuffer' });

    const filename = __dirname + '/cache/4S1F.mp4';
    fs.writeFileSync(filename, Buffer.from(imgRes.data, 'binary'));

    api.sendMessage({
        body: cp,
        attachment: fs.createReadStream(filename),
      },
      event.threadID,
      () => fs.unlinkSync(filename), event.messageID);
  } catch (error) {
    api.sendMessage('An error occurred while fetching the media.', event.threadID, event.messageID);
  }
  }
}
};
