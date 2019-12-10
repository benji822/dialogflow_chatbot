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
Object.defineProperty(exports, "__esModule", { value: true });
const dialogflow_fulfillment_1 = require("dialogflow-fulfillment");
function fulfillment(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        const agent = new dialogflow_fulfillment_1.WebhookClient({ request, response });
        console.log("Dialogflow Request headers: " + JSON.stringify(request.headers));
        console.log("Dialogflow Request body: " + JSON.stringify(request.body));
        // English handler functions and intent map
        function welcome(agent) {
            agent.add(`Welcome to my agent!`);
        }
        function fallback(agent) {
            agent.add(`I didn't understand`);
            agent.add(`I'm sorry, can you try again?`);
        }
        let enIntentMap = new Map(); // Map functions to English Dialogflow intent names
        enIntentMap.set("Default Welcome Intent", welcome);
        enIntentMap.set("Default Fallback Intent", fallback);
        // French handler functions and intent map
        function bienvenue(agent) {
            agent.add(`Bienvenue à mon agent!`);
        }
        function secours(agent) {
            agent.add(`Je n'ai pas compris`);
            agent.add(`Pouvez-vous essayer encore?`);
        }
        let frIntentMap = new Map(); // Map functions to French Dialogflow intent names
        frIntentMap.set("Default Welcome Intent", bienvenue);
        frIntentMap.set("Default Fallback Intent", secours);
        // Chose which intent map to use based on the language of the request
        console.log(`Request locale: ${agent.locale}`);
        if (agent.locale === "en") {
            agent.handleRequest(enIntentMap);
        }
        else if (agent.locale === "fr") {
            agent.handleRequest(frIntentMap);
        }
    });
}
exports.fulfillment = fulfillment;
