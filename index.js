const express = require('express');
const TelBot = require('./lib/TelBot.js');

const port = 3000;
const botToken = process.env.BOT_TOKEN;

const app = express();
const bot = new TelBot(botToken);

app.get('/', async (req, res) => {
    res.send(`Hello world!`);
});

app.get('/sendMessage', async (req, res) => {
    try {
        const chatId = req.query.chatId;
        const text = req.query.text;
        await bot.sendMessage({ chatId, text });
        res.send("Mensagem enviada.");
    } catch (e) {
        res.send("Erro no envio.");
        console.error(e);
    }
});

app.listen(port, () => {
    console.log(`Servidor iniciado na porta ${port}.`);
});

setInterval(async () => {
    const updates = await bot.getLastUpdates();
    updates
        .filter(update => update.message)
        .forEach((update => {
            const message = update.message;
            bot.sendMessage({ chatId: message.chat.id, text: "Oi" });
        }));
}, 5000);