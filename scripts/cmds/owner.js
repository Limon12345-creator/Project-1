const { GoatWrapper } = require('fca-liane-utils');
const axios = require('axios');
const baseApiUrl = async () => {
  const base = await axios.get('https://raw.githubusercontent.com/EwrShAn25/ShAn.s-Api/refs/heads/main/Api.json');
  return base.data.shan;
};

module.exports = {
  config: {
    name: "owner",
    aliases: ["shanke"],
    version: "2.0.0",
    author: "𝗦𝗵𝗔𝗻",
    role: 0,
    shortDescription: "Show owner information",
    longDescription: "Displays information about the bot owner with a random video from API",
    category: "𝗜𝗡𝗙𝗢",
    guide: "{pn}"
  },

  onStart: async function ({ api, event }) {
    try {
      api.setMessageReaction('💀', event.messageID, (err) => {}, true);

      const ShAnInfo = {
        name: '🔗LIMON HOSSAIN SHUVO',
        gender: '𝑴𝑨𝑳𝑬',
        birthday: '13-10-𝟐𝟎𝟎7',
        religion: '𝑰𝑺𝑳𝑨𝑴',
        hobby: 'PLAYING FF👽',
        messenger: 'https://m.me/Facebookusers.2018',
        relationship: '𝑩𝑶𝑳𝑩𝑶 𝑵𝑨',
        height: '5"10',
        nickname: '♣️SHUVO♠️'
      };

      const ShAn = await axios.get(`${await baseApiUrl()}/ShAn-owner`, {
        timeout: 30000 // 30 seconds timeout
      });
      
      if (!ShAn.data || !ShAn.data.url) {
        throw new Error("❌ Invalid API response format");
      }
      
      const ShaN = ShAn.data.url;
      
      const messageBody = `
╔════ஜ۩۞۩ஜ═══╗
   𝐎𝐖𝐍𝐄𝐑 𝐈𝐍𝐅𝐎 
╚════ஜ۩۞۩ஜ═══╝
❖ 𝗡𝗔𝗠𝗘: ${ShAnInfo.name}
❖ 𝗚𝗘𝗡𝗗𝗘𝗥: ${ShAnInfo.gender}
❖ 𝗕𝗜𝗥𝗧𝗛𝗗𝗔𝗬: ${ShAnInfo.birthday}
❖ 𝗥𝗘𝗟𝗜𝗚𝗜𝗢𝗡: ${ShAnInfo.religion}
❖ 𝗥𝗘𝗟𝗔𝗧𝗜𝗢𝗡𝗦𝗛𝗜𝗣: ${ShAnInfo.relationship}
❖ 𝗛𝗢𝗕𝗕𝗬: ${ShAnInfo.hobby}
❖ 𝗛𝗘𝗜𝗚𝗛𝗧: ${ShAnInfo.height}
❖ 𝗠𝗘𝗦𝗦𝗘𝗡𝗚𝗘𝗥: ${ShAnInfo.messenger}
❖ 𝗡𝗜𝗖𝗞𝗡𝗔𝗠𝗘: ${ShAnInfo.nickname}

💝 𝗧𝗛𝗔𝗡𝗞𝗦 𝗙𝗢𝗥 𝗨𝗦𝗜𝗡𝗚 𝗠𝗘 💝
      `;

      
      await api.sendMessage({
        body: messageBody,
        attachment: await global.utils.getStreamFromURL(ShaN)
      }, event.threadID, event.messageID);

      
      api.setMessageReaction('✅', event.messageID, (err) => {}, true);
    } catch (error) {
      console.error('Error in owner command:', error);

      api.setMessageReaction('❌', event.messageID, (err) => {}, true);
      return api.sendMessage('An error occurred while processing the command. Please try again later.', event.threadID);
    }
  }
};
const wrapper = new GoatWrapper(module.exports);
wrapper.applyNoPrefix({ allowPrefix: true });
