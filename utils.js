const ssmStore = require("aws-param-store");
const fs = require("fs");
const path = require("path");
const util = require('util');
const axios = require("axios");

const serverPath = path.dirname(process.mainModule.filename)
// Convert fs.readFile into Promise version of same    
const readFile = util.promisify(fs.readFile);
// get keys from AWS
const getKeys = ssmStore.getParameterSync(
  [
    "yandex_API_01"
  ], {
    region: "eu-north-1"
  }

);

// read data from file
const readFromFile = async (filename) => {
  console.log('filename:', filename)
  const filePath = path.join(serverPath, "db", filename);
  if (fs.existsSync(filePath)) {
    try {
      dataPromise = await readFile(filePath, "utf8");
      return dataPromise;
    } catch (error) {
      console.log('error:', error)
    }
  }
}

const getData = async url => {
  try {
    const response = await axios.get(url);
    const data = response.data;
    return data
  } catch (error) {
    console.log(error);
  }
};

exports.config = {
  yandex_API: getKeys.Parameters[0].Value,
  axios: getData
}

