const fs = require("fs");
const path = require("path");

/**
 * GoatBot module: GroupLock
 * Locks group name (title), theme (color), emoji, and optionally group picture so nobody can change them.
 *
 * Commands:
 *  - groupLock on            → lock current name/theme/emoji; if you reply with an image, that image is locked too
 *  - groupLock off           → unlock everything
 *  - groupLock status        → show what is locked
 *  - groupLock relock        → update stored locks to the group's current values (name/theme/emoji)
 *  - groupLock pic           → when replying to a photo, saves it as the locked group picture
 *
 * Notes:
 *  - This module reverts changes immediately after someone edits name/theme/emoji/pic.
 *  - For picture lock, you MUST provide an image once using "groupLock pic" (reply to an image).
 *  - Works in any thread where it's turned on.
 */

const DATA_DIR = path.join(__dirname, "cache");
const DATA_FILE = path.join(DATA_DIR, "grouplock.json");

function ensureStore() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify({}), "utf8");
}

function readStore() {
  ensureStore();
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  } catch (e) {
    return {};
  }
}

function writeStore(data) {
  ensureStore();
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf8");
}

async function getCurrentThreadSnapshot(api, threadID) {
  const info = await api.getThreadInfo(threadID);
  return {
    name: info.threadName || "",
    emoji: info.emoji || "",
    color: info.color || "",
    imageSrc: info.imageSrc || null
  };
}

module.exports = {
  config: {
    name: "groupLock",
    aliases: ["grouplock", "lockgroup", "gl"],
    version: "1.2.0",
    author: "Abdul Alim",
    countDown: 5,
    role: 1, // only admins/mods can toggle
    shortDescription: "Lock group name/theme/emoji/pic",
    longDescription: "Prevents anyone from changing the group title, theme (color), emoji and optionally the group picture by instantly reverting changes.",
    category: "group",
    guide: {
      en: "{pn} on | off | status | relock | pic (reply to an image)"
    }
  },

  onStart: async function({ api, event, message, args }) {
    try {
      const threadID = event.threadID;
      const store = readStore();
      const key = String(threadID);
      const sub = (args[0] || "").toLowerCase();

      if (!sub || ["help", "-h", "--help"].includes(sub)) {
        return message.reply(
          "GroupLock usage:\n" +
          "• groupLock on — lock current name/theme/emoji; reply to an image to lock pic now.\n" +
          "• groupLock pic — reply to an image to lock it as group picture.\n" +
          "• groupLock relock — refresh locks to current values.\n" +
          "• groupLock status — show what is locked.\n" +
          "• groupLock off — disable and remove locks."
        );
      }

      if (sub === "on") {
        const snap = await getCurrentThreadSnapshot(api, threadID);
        store[key] = store[key] || {};
        store[key].enabled = true;
        store[key].name = snap.name;
        store[key].emoji = snap.emoji;
        store[key].color = snap.color;
        store[key].picPath = store[key].picPath || null;
        writeStore(store);
        return message.reply(
          `✅ GroupLock enabled.\n• Name: ${snap.name || "(empty)"}\n• Emoji: ${snap.emoji || "(none)"}\n• Theme: ${snap.color || "(default)"}\n• Picture lock: ${store[key].picPath ? "ON" : "OFF (use: groupLock pic)"}`
        );
      }

      if (sub === "relock") {
        const snap = await getCurrentThreadSnapshot(api, threadID);
        if (!store[key] || !store[key].enabled) return message.reply("GroupLock is not enabled here.");
        store[key].name = snap.name;
        store[key].emoji = snap.emoji;
        store[key].color = snap.color;
        writeStore(store);
        return message.reply("🔒 Locks updated to current name/theme/emoji.");
      }

      if (sub === "status") {
        const data = store[key];
        if (!data || !data.enabled) return message.reply("GroupLock is OFF in this thread.");
        return message.reply(
          `🔐 GroupLock is ON.\n• Name: ${data.name || "(empty)"}\n• Emoji: ${data.emoji || "(none)"}\n• Theme: ${data.color || "(default)"}\n• Picture lock: ${data.picPath ? "ON" : "OFF"}`
        );
      }

      if (sub === "pic") {
        const { messageReply, attachments } = event;
        let att = (messageReply && messageReply.attachments && messageReply.attachments[0]) || (event.attachments && event.attachments[0]);
        if (!att || att.type !== "photo") return message.reply("Please reply to an image (or send with the command) to lock it as the group picture.");

        const picFile = path.join(DATA_DIR, `pic_${threadID}_${Date.now()}.jpg`);
        try {
          await global.utils.downloadFile(att.url, picFile);
        } catch (e) {
          return message.reply("Failed to download image. Try again.");
        }
        store[key] = store[key] || {};
        store[key].enabled = true;
        store[key].picPath = picFile;
        writeStore(store);
        return message.reply("🖼️ Group picture is now locked.");
      }

      if (sub === "off") {
        if (store[key]) delete store[key];
        writeStore(store);
        return message.reply("🟢 GroupLock disabled for this thread.");
      }

      return message.reply("Unknown subcommand. Use: on | off | status | relock | pic");
    } catch (err) {
      console.error(err);
      return message.reply("GroupLock error: " + err.message);
    }
  },

  onEvent: async function({ api, event }) {
    const { logMessageType = "", threadID, author, type } = event;
    if (type !== "event" || !threadID) return;

    const store = readStore();
    const data = store[String(threadID)];
    if (!data || !data.enabled) return;

    if (author && author === api.getCurrentUserID()) return;

    try {
      switch (logMessageType) {
        case "log:thread-name": {
          if (typeof data.name === "string") {
            await api.setTitle(data.name, threadID);
            await api.sendMessage("⚠️ Group name is locked. Change reverted.", threadID);
          }
          break;
        }
        case "log:thread-icon": {
          if (typeof data.emoji === "string") {
            await api.changeThreadEmoji(data.emoji, threadID);
            await api.sendMessage("⚠️ Group emoji is locked. Change reverted.", threadID);
          }
          break;
        }
        case "log:thread-color": {
          if (typeof data.color === "string") {
            await api.changeThreadColor(data.color, threadID);
            await api.sendMessage("⚠️ Group theme is locked. Change reverted.", threadID);
          }
          break;
        }
        case "log:thread-image": {
          if (data.picPath && fs.existsSync(data.picPath)) {
            try {
              await api.changeGroupImage(fs.createReadStream(data.picPath), threadID);
              await api.sendMessage("⚠️ Group picture is locked. Change reverted.", threadID);
            } catch (e) {
              console.error("Reverting group image failed:", e.message);
            }
          }
          break;
        }
        default:
          break;
      }
    } catch (e) {
      console.error("GroupLock revert error:", e);
    }
  }
};
