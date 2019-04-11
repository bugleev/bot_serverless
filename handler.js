const { axios, yandex_API } = require("./utils")
const yandexData = require('./db/yandex.json')
const responseGenerator = require('./bots/Response')


module.exports.botResponse = async event => {
  const { queryResult: result, session } = JSON.parse(event.body);
  if (result.action === "setPagination") {
    const urlFromContext = result.outputContexts.find(
      el => el.name.split("/").reverse()[0] === "bot_pagination_start"
    ).parameters.url;
    const offset = result.parameters.page > 0 ? result.parameters.page - 1 : 0;
    let yandexURL = `${urlFromContext}&offset=${offset * 5}`;
    const dataFromAPI = await axios(yandexURL);
    return responseGenerator.createResponse(dataFromAPI, session);
  }
  if (result.action === "getSchedules") {
    const { from, to, date } = result.parameters;
    let fromCity = yandexData.find(el => el.value === from);
    let toCity = yandexData.find(el => el.value === to);
    if (!fromCity || !toCity) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          fulfillmentText: "Возникли проблемы при поиске,попробуйте еще раз!"
        }),
        headers: {
          "Content-Type": "application/json;charset=UTF-8"
        }
      };
    }
    let dateTxt = new Date(date).toISOString();
    let yandexURL = `https://api.rasp.yandex.net/v3.0/search/?apikey=${yandex_API}&format=json&from=${
      fromCity.code
      }&to=${toCity.code}&lang=ru_RU&page=1&limit=5&date=${dateTxt}
      `;
    const dataFromAPI = await axios(yandexURL);
    return responseGenerator.createResponse(dataFromAPI, session);
  }
};
