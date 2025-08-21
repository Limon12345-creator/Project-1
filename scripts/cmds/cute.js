(cmd install cute.js const axios = require('axios');

const baseApiUrl = async () => {
  const base = await axios.get('https://raw.githubusercontent.com/EwrShAn25/ShAn.s-Api/refs/heads/main/Api.json');
  return base.data.shan;
};

module.exports = {
  config: { 
    name: "cute",
    version: "2.0",
    author: "𝗦𝗵𝗔𝗻", // DO NOT CHANGE AUTHOR INFORMATION
    countDown: 20,
    role: 0,
    shortDescription: {
      en: "Send you a girl image&video"
    },
    longDescription: {
      en: "Send you a cute girl image&video"
    },
    category: "𝗠𝗘𝗗𝗜𝗔",
    guide: {
      en: "{p}{n}"
    },
  },

  onStart: async function ({ message }) {
    try {
      const loadingMessage = await message.reply("W8 Bby 🧐...");
      
      const ShAn = await axios.get(`${await baseApiUrl()}/ShAn-cute`, {
        timeout: 10000 // 10 seconds timeout
      });
      
      if (!ShAn.data || !ShAn.data.ShAn) {
        throw new Error("❌ Invalid API response format");
      }
      
      const ShaN = ShAn.data.ShAn;
      
      message.reply({
        body: '「 Dekho Ami Koto Cute 😩👀 」',
        attachment: await global.utils.getStreamFromURL(ShaN)
      });

      await message.unsend(loadingMessage.messageID);
      
    } catch (error) {
      console.error('Error:', error);
      
      try {
        await message.reply("⚠ Sorry, the photo couldn't be loaded right now. Possible reasons:\n\n• API server is down\nPlease Contact 🎀ShAn...");
      } catch (e) {
        console.error('Failed to send error message:', e);
      }
    }
  }
};
