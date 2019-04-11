const format = require("date-fns/format");
const distanceInWords = require("date-fns/distance_in_words");
const ruLocale = require('date-fns/locale/ru');
const WebchatBot = require('./WebchatBot');
const TelegramBot = require('./TelegramBot');
const { yandex_API } = require("../utils")
class BotResponse {
  constructor() {
    this.TRANSPORT = {
      plane: "самолет",
      train: "поезд",
      suburban: "электричка",
      bus: "автобус",
      water: "водный транспорт",
      helicopter: "вертолет"
    };
    this.responseBody = {};
  }
  createResponse(data, session) {
    const payload = this.createPayload(data);
    this.responseBody = { payload };
    if (this.getPagination(data.pagination))
      this.setPaginationContext(data.search, session);
    return {
      statusCode: 200,
      body: JSON.stringify(this.responseBody),
      headers: {
        "Content-Type": "application/json;charset=UTF-8"
      }
    };
  }
  setPaginationContext({ to, from, date }, session) {
    this.responseBody.outputContexts = [
      {
        name: `${session}/contexts/bot_pagination_start`,
        lifespanCount: 5,
        parameters: {
          url: `https://api.rasp.yandex.net/v3.0/search/?apikey=${yandex_API}&format=json&from=${
            from.code
            }&to=${to.code}&lang=ru_RU&page=1&limit=5&date=${date}`
        }
      }
    ];
  }

  getDuration(secs) {
    const timeObj = new Date(secs * 1000);
    var result = distanceInWords(new Date(null), timeObj, { locale: ruLocale });
    return result;
  }
  getTransportType(type) {
    return this.TRANSPORT[type];
  }

  getPagination({ total, limit, offset }) {
    const totalPages = Math.ceil(total / limit);
    if (totalPages <= 1) return null;
    const currentPage = offset / 5 + 1;
    let text = `Страница ${currentPage} / ${totalPages}`;
    return text;
  }
  createPayload(data) {
    let messages = [];
    data.segments.forEach(el => {
      const {
        arrival,
        departure,
        thread: { transport_type, title },
        duration
      } = el;
      const arr = format(arrival, "DD MMMM HH:mm", { locale: ruLocale });
      const dep = format(departure, "DD MMMM HH:mm", { locale: ruLocale });
      const transport = this.getTransportType(transport_type);
      const time = this.getDuration(duration);
      const pages = this.getPagination(data.pagination);
      messages.push({
        arrival: arr,
        departure: dep,
        transport,
        duration: time,
        title,
        pages
      });
    });
    return {
      webChat: WebchatBot.createRichMessage(messages),
      telegram: TelegramBot.createRichMessage(messages)
    };
  }
}
module.exports = new BotResponse();