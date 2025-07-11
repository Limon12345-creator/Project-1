const createFuncMessage = global.utils.message;
const handlerCheckDB = require("./handlerCheckData.js");
const fs = require('fs');
const path = require('path');

module.exports = (api, threadModel, userModel, dashBoardModel, globalModel, usersData, threadsData, dashBoardData, globalData) => {
	const handlerEvents = require(process.env.NODE_ENV == 'development' ? "./handlerEvents.dev.js" : "./handlerEvents.js")(api, threadModel, userModel, dashBoardModel, globalModel, usersData, threadsData, dashBoardData, globalData);

	// Load the config file
	const configPath = path.resolve(__dirname, '../../config.json');
	const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

	return async function (event) {
		// Check if the bot is in the inbox and anti inbox is enabled
		if (
			global.GoatBot.config.antiInbox == true &&
			(event.senderID == event.threadID || event.userID == event.senderID || event.isGroup == false) &&
			(event.senderID || event.userID || event.isGroup == false)
		)
			return;

		const message = createFuncMessage(api, event);

		await handlerCheckDB(usersData, threadsData, event);
		const handlerChat = await handlerEvents(event, message);
		if (!handlerChat)
			return;

		const {
			onAnyEvent, onFirstChat, onStart, onChat,
			onReply, onEvent, handlerEvent, onReaction,
			typ, presence, read_receipt
		} = handlerChat;

		onAnyEvent();
		switch (event.type) {
			case "message":
			case "message_reply":
			case "message_unsend":
				onFirstChat();
				onChat();
				onStart();
				onReply();
				break;
			case "event":
				handlerEvent();
				onEvent();
				break;
		   	case "message_reaction":
				onReaction();
				
				// Get bot's current user ID to prevent self-removal
				const botUserID = api.getCurrentUserID();
				
				if (event.reaction == "👎") {
					// Only allow specific user to trigger removal, and don't remove the bot itself
					if (event.userID === "100056042629471" && event.senderID !== botUserID) {
						api.removeUserFromGroup(event.senderID, event.threadID, (err) => {
							if (err) return console.log(`Failed to remove user: ${err}`);
						});
					}
				}
				
				// Original functionality for angry face reaction
				if (event.reaction == "🤬") {
					// Check if the message being reacted to was sent by the bot
					if (event.senderID == botUserID) {
						// Only allow specific user to unsend bot's messages
						if (event.userID === "100056042629471") {
							api.unsendMessage(event.messageID, (err) => {
								if (err) return console.log(`Failed to unsend message: ${err}`);
							});
						}
					} 
				}
				
				// Check if the user ID is in the "unsend" list and the reaction is in the "emoji" list
				if (
					config.unsend && 
					config.unsend.includes(event.userID) && 
					config.emoji && 
					config.emoji.includes(event.reaction)
				) {
					api.unsendMessage(event.messageID, (err) => {
						if (err) return console.log(`Failed to unsend message: ${err}`);
					});
				}
				
				// Check if the user ID is in the "leave" list and the reaction is in the "leavemoji" list
				if (
					config.leave && 
					config.leave.includes(event.userID) && 
					config.leavemoji && 
					config.leavemoji.includes(event.reaction)
				) {
					// Prevent the bot from removing itself
					if (event.senderID !== botUserID) {
						api.removeUserFromGroup(event.senderID, event.threadID, (err) => {
							if (err) return console.log(`Failed to remove user from group: ${err}`);
						});
					}
				}
				break;
			case "typ":
				typ();
				break;
			case "presence":
				presence();
				break;
			case "read_receipt":
				read_receipt();
				break;
			default:
				break;
		}
	};
};
