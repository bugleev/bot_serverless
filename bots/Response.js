const format = require("date-fns/format");
const distanceInWords = require("date-fns/distance_in_words");
const ruLocale = require('date-fns/locale/ru');
const WebchatBot = require('./WebchatBot');
const TelegramBot = require('./TelegramBot');

class BotResponse {
  constructor() {
    this.TRANSPORT = {
      plane: "самолет",
      train: "поезд",
      suburban: "электричка",
      bus: "автобус",
      water: "водный транспорт",
      helicopter: "вертолет"
    }
  }
  createResponse(items) {
    const payload = this.createPayload(items);
    return {
      statusCode: 200,
      body: JSON.stringify({ payload }),
      headers: {
        "Content-Type": "application/json;charset=UTF-8"
      }
    }
  }
  getDuration(secs) {
    const timeObj = new Date(secs * 1000);
    var result = distanceInWords(
      new Date(null),
      timeObj,
      { locale: ruLocale }
    )
    return result;
  }
  defineTransportType(type) {
    return this.TRANSPORT[type]
  }

  createPayload(items) {
    let messages = [];
    items.forEach(el => {
      const { arrival, departure, thread: { transport_type }, duration } = el;
      const arr = format(
        arrival,
        'DD MMMM HH:mm',
        { locale: ruLocale }
      )
      const dep = format(
        departure,
        'DD MMMM HH:mm',
        { locale: ruLocale }
      )
      const transport = this.defineTransportType(transport_type);
      const time = this.getDuration(duration);
      messages.push({ arrival: arr, departure: dep, transport, duration: time });
    })
    return {
      webChat: WebchatBot.createRichMessage(messages),
      telegram: TelegramBot.createRichMessage(messages)
    };
  }
}
module.exports = new BotResponse()