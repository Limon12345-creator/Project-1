// Required modules
const axios = require("axios");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const { MONGODB_URI } = require("./DB/Mongodb.json");

const separateMongoose = require('mongoose');

let voiceConnection;
let voiceSchema;
let settingsSchema;
let Voice;
let VoiceSettings;

const connectToDatabase = async () => {
  try {
    if (!voiceConnection || voiceConnection.readyState !== 1) {
      voiceConnection = separateMongoose.createConnection(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });

      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Database connection timeout'));
        }, 10000);

        voiceConnection.once('open', () => {
          clearTimeout(timeout);
          console.log('Voice database connected:', MONGODB_URI.replace(/\/\/.*@/, '//***:***@'));
          resolve();
        });

        voiceConnection.once('error', (error) => {
          clearTimeout(timeout);
          console.error('Voice database connection failed:', error);
          reject(error);
        });
      });
    }

    if (!voiceSchema) {
      voiceSchema = new separateMongoose.Schema({
        name: { type: String, required: true, unique: true },
        uploadedBy: { type: String, required: true },
        fileSize: { type: Number, default: 0 },
        file: { type: Buffer, required: true },
        keywords: [{ type: String }],
        createdAt: { type: Date, default: Date.now }
      });

      settingsSchema = new separateMongoose.Schema({
        threadID: { type: String, required: true, unique: true },
        voiceMode: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now }
      });

      Voice = voiceConnection.model("VoiceClips", voiceSchema);
      VoiceSettings = voiceConnection.model("VoiceClipSettings", settingsSchema);
    }

    return true;
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
};

const sendVoiceClip = async (api, threadID, voiceBuffer, voiceName = "") => {
  const tempDir = path.join(__dirname, "temp");
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

  const filename = `voice_${Date.now()}.mp3`;
  const filepath = path.join(tempDir, filename);

  fs.writeFileSync(filepath, voiceBuffer);
  const attachment = fs.createReadStream(filepath);

  await api.sendMessage({
    body: voiceName ? `🎵 ${voiceName}` : "",
    attachment
  }, threadID);

  setTimeout(() => {
    if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
  }, 1000);
};

const getFileInfo = (filepath) => {
  try {
    const stats = fs.statSync(filepath);
    return {
      size: stats.size
    };
  } catch {
    return { size: 0 };
  }
};

const downloadFile = async (url, filepath) => {
  const response = await axios({ method: 'GET', url, responseType: 'stream' });
  const writer = fs.createWriteStream(filepath);
  response.data.pipe(writer);
  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
};

const escapeRegex = text => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const findMatchingVoice = async (messageText) => {
  try {
    const voices = await Voice.find({}).lean();
    const lowerMessageText = messageText.toLowerCase();

    for (const voice of voices) {
      const namePattern = new RegExp(`\\b${escapeRegex(voice.name.toLowerCase())}\\b`, 'i');
      if (namePattern.test(lowerMessageText)) return voice;
    }

    for (const voice of voices) {
      if (voice.keywords?.length) {
        for (const keyword of voice.keywords) {
          const keywordPattern = new RegExp(`\\b${escapeRegex(keyword.toLowerCase())}\\b`, 'i');
          if (keywordPattern.test(lowerMessageText)) return voice;
        }
      }
    }

    return null;
  } catch (err) {
    console.error('Match error:', err);
    return null;
  }
};

module.exports = {
  config: {
    name: "voice",
    version: "3.3",
    author: "nur",
    countDown: 1,
    role: 0,
    shortDescription: { en: "Voice manager with DB storage" },
    description: { en: "Add, remove, list, and auto-play voice clips stored in DB" },
    category: "media",
    guide: {
      en: `
{prefix}voice add <name> => Reply to a voice to save
{prefix}voice remove <name> => Remove a clip
{prefix}voice list => List all clips
{prefix}voice <name> => Play by name
{prefix}voice => Random clip
{prefix}voice on/off => Enable/disable auto
{prefix}voice status => Settings status
`.trim()
    }
  },

  onStart: async function ({ event, args, message, api }) {
    await connectToDatabase();

    const cmd = args[0]?.toLowerCase();
    const reply = event.messageReply;
    const threadID = event.threadID;
    const senderID = event.senderID;
    let settings = await VoiceSettings.findOne({ threadID }) || new VoiceSettings({ threadID });
    if (!settings.createdAt) await settings.save();

    if (cmd === "add") {
      const name = args.slice(1).join(" ").trim().toLowerCase();
      if (!reply) return message.reply("❌ Reply to a voice message.");
      if (!name) return message.reply("❌ Provide a name.");

      const attachment = reply.attachments?.[0];
      if (!attachment || !["audio", "voice"].includes(attachment.type)) {
        return message.reply("❌ Must be a voice/audio reply.");
      }

      const exists = await Voice.findOne({ name });
      if (exists) return message.reply(`⚠️ '${name}' already exists.`);

      const tempDir = path.join(__dirname, "temp");
      if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
      const filename = `add_${Date.now()}.mp3`;
      const filepath = path.join(tempDir, filename);

      await downloadFile(attachment.url, filepath);
      const buffer = fs.readFileSync(filepath);
      const size = getFileInfo(filepath).size;

      const voice = new Voice({ name, uploadedBy: senderID, fileSize: size, file: buffer, keywords: [name] });
      await voice.save();

      fs.unlinkSync(filepath);
      await message.reply(`✅ Saved '${name}'`);
      await sendVoiceClip(api, threadID, buffer, name);
    }

    else if (cmd === "remove") {
      const name = args.slice(1).join(" ").trim().toLowerCase();
      if (!name) return message.reply("❌ Provide a name to remove.");
      const deleted = await Voice.findOneAndDelete({ name });
      if (!deleted) return message.reply(`❌ '${name}' not found.`);
      return message.reply(`✅ Removed '${name}'`);
    }

    else if (cmd === "list") {
      const voices = await Voice.find({}).lean();
      if (!voices.length) return message.reply("📭 No voices saved.");
      const text = voices.map((v, i) => `${i + 1}. ${v.name}`).join("\n");
      return message.reply(`🎵 Voice Clips:\n\n${text}`);
    }

    else if (cmd === "on") {
      settings.voiceMode = true;
      settings.updatedAt = new Date();
      await settings.save();
      return message.reply("🔊 Auto voice mode: ON");
    }

    else if (cmd === "off") {
      settings.voiceMode = false;
      settings.updatedAt = new Date();
      await settings.save();
      return message.reply("🔇 Auto voice mode: OFF");
    }

    else if (cmd === "status") {
      const count = await Voice.countDocuments();
      const mode = settings.voiceMode ? "Enabled" : "Disabled";
      return message.reply(`🎙️ Voice Settings:\nVoices: ${count}\nAuto Mode: ${mode}`);
    }

    else if (cmd) {
      const name = args.join(" ").toLowerCase();
      const clip = await Voice.findOne({ name: { $regex: new RegExp(`^${escapeRegex(name)}$`, 'i') } });
      if (!clip) return message.reply(`❌ '${name}' not found.`);
      await sendVoiceClip(api, threadID, clip.file, clip.name);
    }

    else {
      const voices = await Voice.find({}).lean();
      if (!voices.length) return message.reply("❌ No clips available.");
      const random = voices[Math.floor(Math.random() * voices.length)];
      await sendVoiceClip(api, threadID, random.file, random.name);
    }
  },

  onChat: async function ({ event, api }) {
    await connectToDatabase();
    const threadID = event.threadID;
    const messageText = event.body?.toLowerCase() || "";

    if (!messageText || messageText.length < 2 || /^\.|^!/.test(messageText)) return;

    const settings = await VoiceSettings.findOne({ threadID });
    if (!settings?.voiceMode) return;

    const match = await findMatchingVoice(messageText);
    if (match) await sendVoiceClip(api, threadID, match.file, match.name);
  }
};
