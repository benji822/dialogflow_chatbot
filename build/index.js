"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const axios_1 = __importDefault(require("axios"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const weatherFulfillment_1 = require("./weatherFulfillment");
const app = express_1.default();
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
app.get("/", (req, res) => {
    res.send("Welcome to Movie API");
});
app.post("/weather", weatherFulfillment_1.fulfillment);
app.post("/get-movie-details", (req, res) => {
    const movieToSearch = req.body.queryResult &&
        req.body.queryResult.parameters &&
        req.body.queryResult.parameters.movie
        ? req.body.queryResult.parameters.movie
        : "Joker";
    const reqUrl = encodeURI(`http://www.omdbapi.com/?t=${movieToSearch}&apikey=${process.env.API_KEY}`);
    axios_1.default
        .get(reqUrl)
        .then(responseFromAPI => {
        const { Title, Year, Director, Actors, Plot } = responseFromAPI.data;
        const dataToSend = `${Title} was released in the year ${Year}. It is directed by ${Director} and stars ${Actors}.\n Here some glimpse of the plot: ${Plot}`;
        return res.json({
            fulfillmentText: dataToSend,
            facebook: {
                text: dataToSend
            },
            source: "get-movie-details"
        });
    })
        .catch(error => {
        console.log(error);
        return res.json({
            fulfillmentText: "Could not get results at this time",
            source: "get-movie-details"
        });
    });
});
app.listen(process.env.PORT || 8080, () => {
    console.log("Server is up and running...");
});
