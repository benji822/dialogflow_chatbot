require("dotenv").config();
import axios from "axios";
import bodyParser from "body-parser";
import express, { Request, Response } from "express";
import { fulfillment } from "./weatherFulfillment";

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Movie API");
});

app.post("/weather", fulfillment);

app.post("/get-movie-details", (req: Request, res: Response) => {
  const movieToSearch: string =
    req.body.queryResult &&
    req.body.queryResult.parameters &&
    req.body.queryResult.parameters.movie
      ? req.body.queryResult.parameters.movie
      : "Joker";
  const reqUrl = encodeURI(
    `http://www.omdbapi.com/?t=${movieToSearch}&apikey=${process.env.API_KEY}`
  );

  axios
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
