const fs = require("fs");

module.exports.config = {
  name: "addowner",
  version: "1.3.0",
  author: "Abdul Alim",
  countDown: 5,
  role: 0,
  shortDescription: "Adds preset owners to the group",
  category: "ADD OWNER",
  guide: {
    en: "{p}addowner"
  }
};

// Owner UID list
const ownerUIDs = [
  "100034630383353",
  "61573391511905",
  "100056042629471"
];

module.exports.onStart = async function({ api, event }) {
  try {
    const threadID = event.threadID;
    let added = [];
    let already = [];
    let failed = [];
    let mentions = [];

    const info = await api.getThreadInfo(threadID);

    for (let uid of ownerUIDs) {
      try {
        if (info.participantIDs.includes(uid)) {
          already.push(uid);
          const userInfo = await api.getUserInfo(uid);
          const name = userInfo[uid]?.name || "Unknown User";
          mentions.push({ tag: name, id: uid });
          continue;
        }

        await api.addUserToGroup(uid, threadID);

        const userInfo = await api.getUserInfo(uid);
        const name = userInfo[uid]?.name || "Unknown User";

        added.push(name);
        mentions.push({ tag: name, id: uid });

        // Optional delay to prevent rate limit
        await new Promise(res => setTimeout(res, 500));

      } catch (err) {
        failed.push(uid);
      }
    }

    // Build the formatted report
    let msg = "📢  [ Add Owner Report ] \n\n";

    if (added.length) msg += `✅ Added:\n${added.map((n, i) => `${i+1}. @${n}`).join("\n")}\n\n`;
    if (already.length) msg += `⚠️ Already in group:\n${already.map((uid, i) => {
      const m = mentions.find(x => x.id === uid);
      return `${i+1}. @${m?.tag || "Unknown"}`;
    }).join("\n")}\n\n`;
    if (failed.length) msg += `❌ Failed to add:\n${failed.map((uid, i) => `${i+1}. UID: ${uid}`).join("\n")}\n\n`;

    await api.sendMessage({ body: msg, mentions }, threadID, event.messageID);

  } catch (e) {
    await api.sendMessage("❌ Something went wrong! " + e.message, event.threadID, event.messageID);
  }
};
