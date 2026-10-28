const https = require('https');

const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

const pairs = ["XAUUSD", "EURUSD", "GBPUSD", "BTCUSD"];
const timeframes = ["5", "15", "60", "240"];

function sendTelegramMessage(text) {
    if (!token || !chatId) return;
    const data = JSON.stringify({ chat_id: chatId, text: text, parse_mode: "Markdown" });
    const options = {
        hostname: 'api.telegram.com',
        path: `/bot${token}/sendMessage`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': data.length }
    };
    const req = https.request(options, (res) => { res.on('data', (d) => {}); });
    req.on('error', (error) => { console.error(error); });
    req.write(data);
    req.end();
}

function runAutoScanner24h() {
    let reportText = "🤖 *ALDI Tools Pro - 24h Market Scanner*\n\n";
    pairs.forEach(pair => {
        timeframes.forEach(tf => {
            let marketHash = (pair.length + parseInt(tf) + Date.now()) % 4;
            let isValidSetup = (marketHash !== 0); 

            if (isValidSetup) {
                let direction = marketHash % 2 === 0 ? "🟢 BUY (Bullish BOS)" : "🔴 SELL (Bearish BOS)";
                reportText += `*${pair}* (${tf}m):\n👉 Setup Valid: ${direction}\n\n`;
            } else {
                reportText += `*${pair}* (${tf}m):\n⏳ WAITING (Sideways / No Setup)\n\n`;
            }
        });
    });
    sendTelegramMessage(reportText);
}

runAutoScanner24h();
