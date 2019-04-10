class TelegramBot {
  createRichMessage(items) {
    let text = "";
    items.forEach((el, i) => {
      let msg = `Тип: ${el.transport}, Отправление: ${el.departure}, Прибытие: ${el.arrival}, В пути: ${el.duration}`;
      let mdMessage = `*${i + 1}.* \`${msg}\` \n`;
      text += mdMessage;
    })
    return {
      text,
      parse_mode: "Markdown"
    };
  }
}
module.exports = new TelegramBot();