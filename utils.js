const ssmStore = require("aws-param-store");
const axios = require("axios");

// get keys from AWS
const getKeys = ssmStore.getParameterSync(["yandex_API_01"], {
  region: "eu-north-1"
});
// create axios function to fetch data
const getData = async url => {
  try {
    const response = await axios.get(url);
    const data = response.data;
    return data;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  yandex_API: getKeys.Parameters[0].Value,
  axios: getData
};
