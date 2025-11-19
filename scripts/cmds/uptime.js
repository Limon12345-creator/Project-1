const fs = require("fs-extra");
const os = require("os");
const path = require("path");

let createCanvas, loadImage;
let canvasAvailable = false;

try {
    const canvas = require("canvas");
    createCanvas = canvas.createCanvas;
    loadImage = canvas.loadImage;
    canvasAvailable = true;
    console.log("✅ [UPTIME] Canvas loaded successfully");
} catch (err) {
    console.log("❌ [UPTIME] Canvas not available:", err.message);
    canvasAvailable = false;
}

function roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
}

function formatUptime(seconds) {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);

    return parts.join(" ");
}

function formatBytes(bytes) {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

async function createUptimeCard(botUptime, systemUptime, cpuUsage, memoryUsage, totalMemory, platform, hostname, networkInfo) {

    if (!canvasAvailable) return null;

    const canvas = createCanvas(1400, 1050);
    const ctx = canvas.getContext("2d");

    try {
        // BACKGROUND
        roundRect(ctx, 0, 0, 1400, 1050, 30);
        ctx.clip();

        const gradient = ctx.createLinearGradient(0, 0, 1400, 1050);
        gradient.addColorStop(0, "#0f0c29");
        gradient.addColorStop(0.5, "#302b63");
        gradient.addColorStop(1, "#24243e");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 1400, 1050);

        // HEADER
        roundRect(ctx, 50, 50, 1300, 120, 20);
        ctx.fillStyle = "rgba(255,255,255,0.1)";
        ctx.fill();

        ctx.font = "bold 64px Arial";
        ctx.fillStyle = "#FFD700";
        ctx.textAlign = "center";
        ctx.fillText("SYSTEM PERFORMANCE", 700, 130);

        // UPTIME CARDS
        const leftCardX = 70;
        const rightCardX = 730;
        const cardY = 210;
        const cardWidth = 610;
        const cardHeight = 160;

        const uptimeCards = [
            {
                title: "Bot Uptime",
                value: formatUptime(botUptime),
                subtitle: "Active Session Duration",
                x: leftCardX,
            },
            {
                title: "System Uptime",
                value: formatUptime(systemUptime),
                subtitle: "Server Running Time",
                x: rightCardX,
            }
        ];

        uptimeCards.forEach(card => {
            roundRect(ctx, card.x, cardY, cardWidth, cardHeight, 20);
            ctx.fillStyle = "rgba(255,255,255,0.1)";
            ctx.fill();

            ctx.font = "bold 28px Arial";
            ctx.fillStyle = "#FFD700";
            ctx.textAlign = "left";
            ctx.fillText(card.title, card.x + 40, cardY + 50);

            ctx.font = "bold 44px Arial";
            ctx.fillStyle = "#FFFFFF";
            ctx.fillText(card.value, card.x + 40, cardY + 100);

            ctx.font = "italic 18px Arial";
            ctx.fillStyle = "rgba(255,255,255,0.6)";
            ctx.fillText(card.subtitle, card.x + 40, cardY + 130);
        });

        // CPU CARD
        const perfY = cardY + 175;
        const cpuColor = cpuUsage > 80 ? "#FF6B6B" : cpuUsage > 50 ? "#FFA500" : "#4CAF50";

        roundRect(ctx, leftCardX, perfY, cardWidth, cardHeight, 20);
        ctx.fillStyle = "rgba(255,255,255,0.1)";
        ctx.fill();

        ctx.font = "bold 28px Arial";
        ctx.fillStyle = "#FFD700";
        ctx.fillText("CPU Usage", leftCardX + 40, perfY + 50);

        ctx.font = "bold 44px Arial";
        ctx.fillStyle = cpuColor;
        ctx.fillText(`${cpuUsage.toFixed(1)}%`, leftCardX + 40, perfY + 100);

        // MEMORY CARD
        const memPercent = (memoryUsage / totalMemory) * 100;
        const memColor = memPercent > 80 ? "#FF6B6B" : memPercent > 50 ? "#FFA500" : "#4CAF50";

        roundRect(ctx, rightCardX, perfY, cardWidth, cardHeight, 20);
        ctx.fillStyle = "rgba(255,255,255,0.1)";
        ctx.fill();

        ctx.font = "bold 28px Arial";
        ctx.fillStyle = "#FFD700";
        ctx.fillText("Memory Usage", rightCardX + 40, perfY + 50);

        ctx.font = "bold 32px Arial";
        ctx.fillStyle = memColor;
        ctx.fillText(`${formatBytes(memoryUsage)} / ${formatBytes(totalMemory)}`, rightCardX + 40, perfY + 100);

        // PLATFORM
        const platformY = perfY + 175;

        roundRect(ctx, leftCardX, platformY, 1270, 110, 20);
        ctx.fillStyle = "rgba(255,255,255,0.1)";
        ctx.fill();

        ctx.font = "bold 28px Arial";
        ctx.fillStyle = "#FFD700";
        ctx.fillText("Platform", leftCardX + 40, platformY + 45);

        ctx.font = "bold 38px Arial";
        ctx.fillStyle = "#FFFFFF";
        ctx.fillText(platform.toUpperCase(), leftCardX + 40, platformY + 90);

        ctx.font = "22px Arial";
        ctx.textAlign = "right";
        ctx.fillText(`Updated: ${new Date().toLocaleString()}`, 1320, platformY + 90);

        // NETWORK
        const networkY = platformY + 135;

        roundRect(ctx, leftCardX, networkY, 1270, 160, 20);
        ctx.fillStyle = "rgba(255,255,255,0.1)";
        ctx.fill();

        ctx.font = "bold 28px Arial";
        ctx.textAlign = "left";
        ctx.fillStyle = "#FFD700";
        ctx.fillText("Network Configuration", leftCardX + 40, networkY + 45);

        ctx.font = "bold 26px Arial";
        ctx.fillStyle = "#FFFFFF";
        ctx.fillText(`▣ ${hostname}`, leftCardX + 40, networkY + 90);

        ctx.font = "22px Arial";
        ctx.fillStyle = "rgba(255,255,255,0.9)";

        const ipText = networkInfo.length ? networkInfo.join(" • ") : "No Network Info";
        ctx.fillText(ipText, leftCardX + 40, networkY + 130);

        ctx.font = "italic 20px Arial";
        ctx.textAlign = "center";
        ctx.fillStyle = "rgba(255,215,0,0.7)";
        ctx.fillText("Powered by Goat Bot V3 - NeoKEX", 700, 1020);

        const buffer = canvas.toBuffer("image/png");
        const time = Date.now();
        const tmpDir = path.join(__dirname, "tmp");

        await fs.ensureDir(tmpDir);

        const outPath = path.join(tmpDir, `uptime_${time}.png`);
        await fs.writeFile(outPath, buffer);

        return { stream: fs.createReadStream(outPath), path: outPath };

    } catch (e) {
        console.log("Canvas Error:", e);
        return null;
    }
}

module.exports = {
    config: {
        name: "uptime",
        version: "1.0.0",
        author: "NeoKEX (Fixed by AI)",
        role: 2,
        description: { en: "System performance dashboard" },
        category: "system"
    },

    langs: {
        en: {
            uptimeInfo:
                "▣ System Dashboard\n\n◷ Bot Uptime: %1\n▣ System Uptime: %2\n⚡ CPU Usage: %3%\n◆ Memory: %4 / %5\n⊕ Platform: %6\n▣ Hostname: %7\n⊕ Network: %8"
        }
    },

    onStart: async function ({ message, getLang }) {

        const botUptime = process.uptime();
        const systemUptime = os.uptime();

        // CPU
        const cpus = os.cpus();
        let idle = 0, total = 0;
        cpus.forEach(cpu => {
            for (let type in cpu.times) total += cpu.times[type];
            idle += cpu.times.idle;
        });
        const cpuUsage = 100 - Math.floor((idle / total) * 100);

        // MEMORY
        const totalMemory = os.totalmem();
        const freeMemory = os.freemem();
        const usedMemory = totalMemory - freeMemory;

        const platform = os.platform();
        const hostname = os.hostname();

        // NETWORK
        const network = [];
        const net = os.networkInterfaces();

        Object.keys(net).forEach(intf => {
            net[intf].forEach(iface => {
                if (iface.family === "IPv4" && !iface.internal)
                    network.push(`${intf}: ${iface.address}`);
            });
        });

        try {
            const result = await createUptimeCard(
                botUptime,
                systemUptime,
                cpuUsage,
                usedMemory,
                totalMemory,
                platform,
                hostname,
                network
            );

            if (result) {
                const { stream, path: imgPath } = result;

                stream.on("close", () => fs.unlink(imgPath).catch(() => {}));

                return message.reply({ attachment: stream });
            }
        } catch (err) {
            console.log("Image Error:", err);
        }

        return message.reply(
            getLang(
                "uptimeInfo",
                formatUptime(botUptime),
                formatUptime(systemUptime),
                cpuUsage,
                formatBytes(usedMemory),
                formatBytes(totalMemory),
                platform,
                hostname,
                network.join(", ") || "No Network Info"
            )
        );
    }
};
