const fs = require('fs');
const path = require('path');

module.exports = {
	config: {
		name: "file",
		aliases: ["de", "give"],
		version: "1.0",
		author: "404",
		countDown: 5,
		role: 0,
		shortDescription: {
          en: "Send bot script",
          bn: ""
        },
		longDescription: {
          en: "Send bot specified file from commands or events directory",
          bn: ""
        },
		category: "owner",
		guide: {
          en: "{pn} <filename> or {pn} -e <filename>",
          bn: ""
        }
	},
  langs: {
    en: {
      noPermission: "Uiraa jaa mangeer pulaaa😾...",
      invalidFilename: "Please provide a file name...",
      invalidEventname: "Please provide an event file name after -e [event name].",
      eventNotfound: "Event file not found: %1.js",
      fileNotfound: "File not found: %1.js"
    },
    bn: {
      noPermission: "Uiraa jaa mangeer pulaaa😾...",
      invalidFilename: "Please provide a file name...",
      invalidEventname: "Please provide an event file name after -e [event name].",
      eventNotfound: "Event file not found: %1.js",
      fileNotfound: "File not found: %1.js"
    }
  },

	onStart: async function ({ message, args, api, event, getLang }) {
        const { threadID, messageID } = event;
		const permission = global.GoatBot.config.owner;
		if (!permission.includes(event.senderID)) {
			return api.sendMessage(getLang("noPermission"), threadID, messageID);
		}

		if (args.length === 0) {
			return api.sendMessage(getLang("invalidFilename"), threadID, messageID);
		}

		if (args[0] === '-e') {
			if (args.length < 2) {
				return api.sendMessage(getLang("invalidEventname"), threadID, messageID);
			}
			
			const eventFileName = args[1];
			const eventPath = path.join(__dirname, '..', '..', 'scripts', 'events', `${eventFileName}.js`);
			
			if (!fs.existsSync(eventPath)) {
				return api.sendMessage(getLang("eventNotfound", eventFileName), threadID, messageID);
			}
			
			const fileContent = fs.readFileSync(eventPath, 'utf8');
			return api.sendMessage({ body: fileContent }, threadID, messageID);
		}

		const fileName = args[0];
		const filePath = path.join(__dirname, `${fileName}.js`);
		
		if (!fs.existsSync(filePath)) {
			return api.sendMessage(getLang("fileNotfound", fileName), threadID, messageID);
		}

		const fileContent = fs.readFileSync(filePath, 'utf8');
		api.sendMessage({ body: fileContent }, threadID, );
	}
};
