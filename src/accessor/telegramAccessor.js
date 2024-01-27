const bot_token = process.env.TELEGRAM_BOT_TOKEN || ""
//TELEGRAM_BOT_TOKEN=239482 node app.js
export const notifyEvent = async (chatId, text, url) => {
    const options = {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            chat_id: chatId,
            text: text,
            parse_mode: 'Markdown',
            reply_markup: JSON.stringify({
                inline_keyboard: [[{
                    text: 'SuiScan Link',
                    url: url
                }]]
            })
        }),
    }

    return fetch(`https://api.telegram.org/bot${bot_token}/sendMessage`, options);
}
