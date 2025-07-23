import express, { json } from "express";
import logger from "./logger.js";
import morgan from "morgan";

const app = express();
const port = 3000;
const morganFormat = ":method :url :status :response-time ms";

app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);
// app.get("/", (req, res) => {
//   res.send("hello from earth");
// });
// app.get("/ice-tea", (req, res) => {
//   res.send("ice-tea from earth");
// });
// app.get("/twitter", (req, res) => {
//   res.send("sanjanadotcom");
// });

app.use(express.json());

let demoData = [];
let indexId = 1;
//add data
app.post("/data", (req, res) => {
  const { name, price } = req.body; //u will have a body from express doc
  const newData = { id: indexId++, name, price }; // each time one is injected id++, and name, price is store
  demoData.push(newData); // after that u push the new array to demoData
  res.status(201).send(newData); // 201=All ok as a massage u sent them the data u store
});
//get all data
app.get("/data", (req, res) => {
  res.status(200).send(demoData);
});
//get data through Id
app.get("/data/:id", (req, res) => {
  const data = demoData.find((d) => d.id === parseInt(req.params.id)); ///Params use when we try to find something form URL, in URL all are String so we need to ParseInt that
  if (!data) {
    return res.status(404).send("Not found any data");
  }
  res.status(200).send(data);
});

//update data
app.put("/data/:id", (req, res) => {
  const data = demoData.find((d) => d.id === parseInt(req.params.id));
  if (!data) {
    res.status(404).send("can not find it");
  }
  const { name, price } = req.body;
  data.name = name;
  data.price = price;
  res.status(200).send(data);
});
// delete data
app.delete("/data/:id", (req, res) => {
  const index = demoData.findIndex((d) => d.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).send("nothing to delete");
  }
  demoData.splice(index, 1);
  res.status(204).send("deleted");
});

app.listen(port, () => {
  console.log(`serer is running at port ${port}...`);
});
