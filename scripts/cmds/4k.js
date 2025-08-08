const axios = require('axios');
const fs = require('fs');
const path = require('path');
const getAPIBase = async () => {
  const { data } = await axios.get(
    "https://raw.githubusercontent.com/EwrShAn25/ShAn.s-Api/refs/heads/main/Api.json"
  );
  return data.shan;
};

module.exports = {
	config: {
		name: "4k", 
		version: "1.0", 
		author: "ShAn",
		countDown: 10, 
		role: 0,
		shortDescription: {
			en: "Enhance image quality to 4K resolution"
		}, 
		description: {
			en: "Enhance any image to 4K quality using AI upscaling. Reply to an image or provide an image URL to get enhanced version."
		}, 
		category: "𝐏ʜᴏᴛᴏ 𝐄ᴅɪᴛ",
		guide: {
			en: "{p}{n} - Reply to an image to enhance it\n{p}{n} <image_url> - Enhance image from URL"
		} 
	},

	langs: {
		en: {
			noImage: "❌ Please reply to an image or provide an image URL!",
			processing: "🔄 Enhancing image to 4K quality, please wait...",
			error: "❌ Failed to enhance image. Please try again!",
			invalidUrl: "❌ Invalid image URL provided!",
			success: "✅ Image enhanced to 4K quality!"
		}
	},

	onStart: async function ({ api, args, message, event, getLang }) {
		const { threadID, messageID, messageReply } = event;
		
		let imageUrl = null;
		
		if (messageReply && messageReply.attachments && messageReply.attachments.length > 0) {
			const attachment = messageReply.attachments[0];
			if (attachment.type === "photo") {
				imageUrl = attachment.url;
			}
		}
		else if (args.length > 0) {
			const providedUrl = args[0];
			if (providedUrl.match(/\.(jpeg|jpg|gif|png|webp)$/i) || providedUrl.includes('http')) {
				imageUrl = providedUrl;
			} else {
				return message.reply(getLang("invalidUrl"));
			}
		}

		if (!imageUrl) {
			return message.reply(getLang("noImage"));
		}
		const processingMsg = await message.reply(getLang("processing"));

		try {
			const apiBase = await getAPIBase();
			const response = await axios.get(`${apiBase}/ShAn-4k?url=${encodeURIComponent(imageUrl)}`);
						
			if (response.data && response.data.image) {
				const enhancedImageUrl = response.data.image;
				
				
				const tempPath = path.join(__dirname, 'cache', `4k_${Date.now()}.jpg`);
				
				// Download image
				const imageResponse = await axios({
					method: 'GET',
					url: enhancedImageUrl,
					responseType: 'stream'
				});
				
				const writer = fs.createWriteStream(tempPath);
				imageResponse.data.pipe(writer);
				await new Promise((resolve, reject) => {
					writer.on('finish', resolve);
					writer.on('error', reject);
				});
				api.unsendMessage(processingMsg.messageID);
				const attachment = fs.createReadStream(tempPath);
				
				message.reply({
					body: getLang("success"),
					attachment: attachment
				}, () => {
				
					fs.unlinkSync(tempPath);
				});
				
				return;
			} else {
				throw new Error("No enhanced image in response");
			}

		} catch (error) {
			console.error("Error enhancing image:", error.message);
			
			api.unsendMessage(processingMsg.messageID);
			
			return message.reply(getLang("error"));
		}
	}
};
