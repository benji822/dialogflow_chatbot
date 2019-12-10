"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const dialogflow_fulfillment_1 = require("dialogflow-fulfillment");
const wwoApiKey = "3055043a489640f9b8d142251191012";
function fulfillment(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        const agent = new dialogflow_fulfillment_1.WebhookClient({ request, response });
        // Get the city and date from the request
        let city = request.body.queryResult.parameters["geo-city"]; // city is a required param
        // Get the date for the weather forecast (if present)
        let date = "";
        if (request.body.queryResult.parameters["date"]) {
            date = request.body.queryResult.parameters["date"];
            console.log("Date: " + date);
        }
        // English handler functions and intent map
        function welcome(agent) {
            agent.add(`Welcome to my agent!`);
        }
        function weather(agent) {
            return __awaiter(this, void 0, void 0, function* () {
                yield axios_1.default
                    .get("https://api.worldweatheronline.com/premium/v1/weather.ashx", {
                    params: {
                        format: "json",
                        num_of_days: 1,
                        q: city,
                        key: wwoApiKey,
                        date: date
                    }
                })
                    .then(responseFromAPI => {
                    // After all the data has been received parse the JSON for desired data
                    let weatherData = responseFromAPI.data;
                    let forecast = weatherData["data"]["weather"][0];
                    let location = weatherData["data"]["request"][0];
                    let conditions = weatherData["data"]["current_condition"][0];
                    let currentConditions = conditions["weatherDesc"][0]["value"];
                    // Create response
                    const weatherContent = `Current conditions in the ${location["type"]} 
        ${location["query"]} are ${currentConditions} with a projected high of
        ${forecast["maxtempC"]}°C or ${forecast["maxtempF"]}°F and a low of 
        ${forecast["mintempC"]}°C or ${forecast["mintempF"]}°F on 
        ${forecast["date"]}.`;
                    agent.add(weatherContent);
                });
            });
        }
        function fallback(agent) {
            agent.add(`I didn't understand`);
            agent.add(`I'm sorry, can you try again?`);
        }
        let intentMap = new Map(); // Map functions to English Dialogflow intent names
        intentMap.set("Default Welcome Intent", welcome);
        intentMap.set("weather", weather);
        intentMap.set("Default Fallback Intent", fallback);
        agent.handleRequest(intentMap);
    });
}
exports.fulfillment = fulfillment;
