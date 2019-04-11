class WebchatBot {
  createRichMessage(items) {
    const messages = items.map(
      ({ arrival, departure, transport, duration, title, pages }) => ({
        text: `--- Тип: ${transport} --- Имя: ${title} --- Отправление:  
      ${departure} --- Прибытие: ${arrival} --- В пути: ${duration} ---`,
        pages
      })
    );
    messages.push({ text: 'Введите номер страницы, или "след"/"пред"' });
    return {
      messages
    };
  }
}
module.exports = new WebchatBot();