class TelegramBot {
  createRichMessage(items) {
    let text = items[0].pages ? `\`${items[0].pages}\` \n` : "";
    items.forEach((el, i) => {
      let msg = `Тип: ${el.transport}, Имя: ${el.title}, Отправление: ${
        el.departure
        }, Прибытие: ${el.arrival}, В пути: ${el.duration}`;
      let mdMessage = `*${i + 1}.* \`${msg}\` \n`;
      text += mdMessage;
    });
    text += 'Для навигации введите номер страницы, или "след"/"пред"';
    return {
      text,
      parse_mode: "Markdown"
    };
  }
}
module.exports = new TelegramBot();
