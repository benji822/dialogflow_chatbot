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
        console.log(agent.webhook);
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
        agent.handleRequest(enIntentMap);
    });
}
exports.fulfillment = fulfillment;
