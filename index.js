const Alexa = require("ask-sdk-core");
const https = require('https');

function httpGet() {
  return new Promise(((resolve, reject) => {
    let options = {
      host: 'masterquote.herokuapp.com',
      port: 443,
      path: '/random',
      method: 'GET',
    }
    const request = https.request(options, (response) => {
      response.setEncoding('utf8');
      let returnData = '';
      response.on('data', (chunk) => {
        returnData += chunk;
      });
      response.on('end', () => {
        resolve(JSON.parse(returnData))
      })
      response.on('error', (error) => {
        reject(error);
      })
    });
    request.end();
  }))
}

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === "LaunchRequest";
  },
  async handle(handlerInput) {
    const response = await httpGet();
    const message = `La frase celebre de ${response.results[0].name}, ${response.results[0].quote}`
    return handlerInput.responseBuilder.speak(message).getResponse();
  }
};

exports.handler = Alexa.SkillBuilders.custom()
  .addRequestHandlers(LaunchRequestHandler)
  .lambda();
