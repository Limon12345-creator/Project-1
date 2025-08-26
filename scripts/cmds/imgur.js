const axios = require('axios');

const baseApiUrl = async () => {
  const base = await axios.get('https://raw.githubusercontent.com/EwrShAn25/ShAn.s-Api/refs/heads/main/Api.json');
  return base.data.shan;
};

module.exports = {
  config: {
    name: "imgur",
    aliases: [],
    version: "1.0",
    author: "♡︎ 𝗦𝗵𝗔𝗻 ♡︎",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "𝐂𝐨𝐧𝐜𝐞𝐫𝐭 𝐢𝐦𝐚𝐠𝐞 𝐨𝐫 𝐯𝐢𝐝𝐞𝐨 𝐭𝐨 𝐈𝐦𝐠𝐮𝐫 𝐔𝐑𝐋...",
      bn: "𝐈𝐦𝐠𝐮𝐫 𝐔𝐑𝐋 - এ ইমেজ ও ভিডিও কনভার্ট করুন..."
    },
    longDescription: {
      en: "𝐔𝐩𝐥𝐨𝐚𝐝 𝐢𝐦𝐚𝐠𝐞 𝐨𝐫 𝐯𝐢𝐝𝐞𝐨 𝐭𝐨 𝐈𝐦𝐠𝐮𝐫 𝐛𝐲 𝐫𝐞𝐩𝐥𝐲𝐢𝐧𝐠 𝐭𝐨 𝐩𝐡𝐨𝐭𝐨 𝐮𝐬𝐢𝐧𝐠 𝐚𝐧 𝐞𝐱𝐭𝐞𝐫𝐧𝐚𝐥 𝐀𝐏𝐈...",
      bn: "একটি ছবিতে বা ভিডিওতে রিপ্লাই কর বাহ্যিক 𝐀𝐏𝐈 ব্যবহার করে 𝐈𝐦𝐠𝐮𝐫 - এ ইমেজ আপলোড করুন..."
    },
    category: "media",
    guide: {
      en: "{p}{n} [𝐑𝐞𝐩𝐥𝐲 𝐭𝐨 𝐚𝐧 𝐢𝐦𝐚𝐠𝐞 𝐨𝐫 𝐯𝐢𝐱𝐞𝐨]",
      bn: "{p}{n} [একটি ছবিতে রিপ্লাই করুন]"
    }
  },
  langs: {
    en: {
      noImage: "⚠️ 𝐏𝐥𝐞𝐚𝐬𝐞 𝐫𝐞𝐩𝐥𝐲 𝐭𝐨 𝐚𝐧 𝐢𝐦𝐚𝐠𝐞 𝐨𝐫 𝐯𝐢𝐝𝐞𝐨 𝐭𝐨 𝐮𝐩𝐥𝐨𝐚𝐝 𝐢𝐭 𝐭𝐨 𝐈𝐦𝐠𝐮𝐫...",
      success: "✅ 𝐮𝐩𝐥𝐨𝐚𝐝𝐞𝐝 𝐬𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲!\n\n🔗𝐋𝐢𝐧𝐤: %1",
      failed: "𝐅𝐚𝐢𝐥𝐞𝐝 𝐭𝐨 𝐮𝐩𝐥𝐨𝐚𝐝 𝐢𝐦𝐚𝐠𝐞 𝐨𝐫 𝐯𝐢𝐝𝐞𝐨...",
      error: "❌ 𝐄𝐫𝐫𝐨𝐫: %1"
    },
    bn: {
      noImage: "⚠️ একটি ছবি বা ভিডিও আপলোড করতে ইমেজে রিপ্লাই করুন।",
      success: "✅ সফলভাবে আপলোড হয়েছে!\n\n🔗লিংক: %1",
      failed: "ইমেজ বা ভিডিও আপলোড করতে ব্যর্থ হয়েছে",
      error: "❌ ত্রুটি: %1"
    }
    },

  onStart: async function ({ api, event, getLang }) {
    if (!event.messageReply || !event.messageReply.attachments || event.messageReply.attachments.length === 0) {
      return api.sendMessage(getLang('noImage'), event.threadID, event.messageID);
    }

    const attachment = event.messageReply.attachments[0].url;
    try {
      const apiUrl = `${await baseApiUrl()}/ShAn-imgur`;
      const ShAn = await axios.post(apiUrl, {
        url: attachment
      });

      if (!ShAn.data || !ShAn.data.ShAn) {
        throw new Error('𝐈𝐧𝐯𝐚𝐥𝐢𝐝 𝐫𝐞𝐬𝐩𝐨𝐧𝐬𝐞 𝐟𝐫𝐨𝐦 𝐀𝐏𝐈...');
      }

      const ShaN = ShAn.data.ShAn;
      return api.sendMessage(getLang('success', ShaN), event.threadID, event.messageID);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || getLang('failed');
      return api.sendMessage(getLang('error', errorMessage), event.threadID, event.messageID);
    }
  }
};
