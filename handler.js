const { config } = require("./utils")
const yandexData = require('./db/yandex.json')
const format = require("date-fns/format");
const distanceInWords = require("date-fns/distance_in_words");
const ruLocale = require('date-fns/locale/ru')

const YANDEX_TRANSPORT_TYPES = {
  plane: "самолет",
  train: "поезд",
  suburban: "электричка",
  bus: "автобус",
  water: "водный транспорт",
  helicopter: "вертолет"
}

const respond = payload => {
  return {
    statusCode: 200,
    body: JSON.stringify({ payload }),
    headers: {
      "Content-Type": "application/json"
    }
  }
}
const getDuration = secs => {
  const timeObj = new Date(secs * 1000);
  var result = distanceInWords(
    new Date(null),
    timeObj,
    { locale: ruLocale }
  )
  return result;
}
const defineTransportType = type => YANDEX_TRANSPORT_TYPES[type];

const createPayload = (items) => {
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
    const transport = defineTransportType(transport_type);
    const time = getDuration(duration);
    messages.push({ arrival: arr, departure: dep, transport, duration: time });
  })
  return {
    webChat: {
      messages
    }
  };
}


module.exports.botResponse = async (event) => {
  const result = JSON.parse(event.body).queryResult;
  if (result.allRequiredParamsPresent) {
    const { from, to, date } = result.parameters;
    let fromCode = yandexData.find(el => el.value === from).code;
    let toCode = yandexData.find(el => el.value === to).code;
    let dateTxt = new Date(date).toISOString();
    yandexURL = `https://api.rasp.yandex.net/v3.0/search/?apikey=${config.yandex_API}&format=json&from=${fromCode}&to=${toCode}&lang=ru_RU&page=1&limit=5&offset=0&date=${dateTxt}
      `;
    const fromAPI = await config.axios(yandexURL);
    if (!fromAPI.segments.length) return;
    const message = createPayload(fromAPI.segments);
    return respond(message);
  }

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
