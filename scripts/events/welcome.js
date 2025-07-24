const { getTime, drive } = global.utils;
if (!global.temp.welcomeEvent)
	global.temp.welcomeEvent = {};

module.exports = {
	config: {
		name: "welcome",
		version: "1.7",
		author: "𝑺𝒉𝑨𝒏",
		category: "events"
	},

	langs: {
		vi: {
			session1: "sáng",
			session2: "trưa",
			session3: "chiều",
			session4: "tối",
			welcomeMessage: "Cảm ơn bạn đã mời tôi vào nhóm!\nPrefix bot: %1\nĐể xem danh sách lệnh hãy nhập: %1help",
			multiple1: "bạn",
			multiple2: "các bạn",
			defaultWelcomeMessage: "Xin chào {userName}.\nChào mừng bạn đến với {boxName}.\nChúc bạn có buổi {session} vui vẻ!"
		},
		en: {
			session1: "𝑴𝒐𝒓𝒏𝒊𝒏𝒈",
			session2: "𝑵𝒐𝒐𝑵",
			session3: "𝑨𝒇𝒕𝒆𝒓𝒏𝒐𝒐𝒏",
			session4: "𝑬𝒗𝒆𝒏𝒊𝒏𝒈",
			session5: "𝑵𝒊𝒈𝒉𝒕",
			welcomeMessage: `𝑨𝒔𝒔𝑨𝒍𝒂𝒎𝑼𝒂𝒍𝑨𝒊𝒌𝑼𝒎\n	 `
				+ `\n ☻︎𝑻𝒉𝒆 𝒃𝒐𝒕 𝒉𝒂𝒔 𝒃𝒆𝒆𝒏 𝒄𝒐𝒏𝒏𝒆𝒄𝒕𝒆𝒅 𝒕𝒐 𝒕𝒉𝒆 𝒈𝒓𝒐𝒖𝒑❥︎`
				+ `\n ★𝑩𝒐𝒕 𝒑𝒆𝒓𝒇𝒊𝒙★: %1`
				+ `\n __________________________`
				+ `\n ~𝑶𝒘𝒏𝒆𝒓:https://www.facebook.com/Facebookusers.2018`
				+ `\n __________________________`
				+ `\n 💠|💐𝑻𝒐 𝒗𝒊𝒆𝒘 𝒄𝒐𝒎𝒎𝒂𝒏𝒅𝒔 𝒑𝒍𝒆𝒂𝒔𝒆 𝒆𝒏𝒕𝒆𝒓: %1help`,
			multiple1: "𝑻𝒐 𝑻𝒉𝒆",
			multiple2: "𝑻𝒐 𝑶𝒖𝒓",
			defaultWelcomeMessage: `✨ 𝑨𝒔𝒔𝒂𝒍𝒂𝒎𝒖𝒂𝒍𝒂𝒊𝒌𝒖𝒎 ✨\n 	 \n~🦋 𝑯𝒆𝒍𝒍𝒐 𝑫𝒆𝒂𝒓 {userName}.\n~😽𝑾𝒆𝒍𝒄𝒐𝒎𝒆 {multiple} 𝑪𝒉𝒂𝒕 𝒈𝒓𝒐𝒖𝒑:{boxName} \n~❣︎𝑾𝒉𝒊𝒔𝒉𝒊𝒏𝒈 𝒘𝒆 𝒂 𝒍𝒐𝒗𝒆𝒍𝒚 {session} 😜`
		}
	},

	onStart: async ({ threadsData, message, event, api, getLang }) => {
		if (event.logMessageType == "log:subscribe")
			return async function () {
				const hours = getTime("HH");
				const { threadID } = event;
				const { nickNameBot } = global.GoatBot.config;
				const prefix = global.utils.getPrefix(threadID);
				const dataAddedParticipants = event.logMessageData.addedParticipants;
				// if new member is bot
				if (dataAddedParticipants.some((item) => item.userFbId == api.getCurrentUserID())) {
					if (nickNameBot)
						api.changeNickname(nickNameBot, threadID, api.getCurrentUserID());
					return message.send(getLang("welcomeMessage", prefix));
				}
				// if new member:
				if (!global.temp.welcomeEvent[threadID])
					global.temp.welcomeEvent[threadID] = {
						joinTimeout: null,
						dataAddedParticipants: []
					};

				// push new member to array
				global.temp.welcomeEvent[threadID].dataAddedParticipants.push(...dataAddedParticipants);
				// if timeout is set, clear it
				clearTimeout(global.temp.welcomeEvent[threadID].joinTimeout);

				// set new timeout
				global.temp.welcomeEvent[threadID].joinTimeout = setTimeout(async function () {
					const threadData = await threadsData.get(threadID);
					if (threadData.settings.sendWelcomeMessage == false)
						return;
					const dataAddedParticipants = global.temp.welcomeEvent[threadID].dataAddedParticipants;
					const dataBanned = threadData.data.banned_ban || [];
					const threadName = threadData.threadName;
					const userName = [],
						mentions = [];
					let multiple = false;

					if (dataAddedParticipants.length > 1)
						multiple = true;

					for (const user of dataAddedParticipants) {
						if (dataBanned.some((item) => item.id == user.userFbId))
							continue;
						userName.push(user.fullName);
						mentions.push({
							tag: user.fullName,
							id: user.userFbId
						});
					}
					// {userName}:   name of new member
					// {multiple}:
					// {boxName}:    name of group
					// {threadName}: name of group
					// {session}:    session of day
					if (userName.length == 0) return;
					let { welcomeMessage = getLang("defaultWelcomeMessage") } =
						threadData.data;
					const form = {
						mentions: welcomeMessage.match(/\{userNameTag\}/g) ? mentions : null
					};
					welcomeMessage = welcomeMessage
						.replace(/\{userName\}|\{userNameTag\}/g, userName.join(", "))
						.replace(/\{boxName\}|\{threadName\}/g, threadName)
						.replace(
							/\{multiple\}/g,
							multiple ? getLang("multiple2") : getLang("multiple1")
						)
						.replace(
							/\{session\}/g,
							hours <= 10
								? getLang("session1")
								: hours <= 12
									? getLang("session2")
									: hours <= 18
										? getLang("session3")
										: getLang("session4")
						);

					form.body = welcomeMessage;

					if (threadData.data.welcomeAttachment) {
						const files = threadData.data.welcomeAttachment;
						const attachments = files.reduce((acc, file) => {
							acc.push(drive.getFile(file, "stream"));
							return acc;
						}, []);
						form.attachment = (await Promise.allSettled(attachments))
							.filter(({ status }) => status == "fulfilled")
							.map(({ value }) => value);
					}
					message.send(form);
					delete global.temp.welcomeEvent[threadID];
				}, 1500);
			};
	}
};
