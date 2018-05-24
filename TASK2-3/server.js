const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();

const Logger = require("./helper/logger");

const logger = new Logger();

let clientInstance = 0;
module.exports = (db) => {
  const centralTimer = 5000;
  const clientTimer = 5000;

  app.use(bodyParser.json());

  app.post("/central/:client", async (req, res) => {
    logger.create("central");
    const client = req.params.client;
    logger.print(`Central start work with ${client}`);
    setInterval(async () => {
      await axios
        .get(`http://localhost:3000/central/report/${client}`)
        .then(async (items) => {
          if (items.data) {
            items.data.forEach(async (item) => {
              delete item.id;

              const result = await db[client].update(item, {
                where: {
                  department: item.department
                }
              });

              if (!result[0]) {
                item.office = client;
                await db[client].create(item);
              }
            });

            logger.print(`Central work with ${client}`);
          }
        });
    }, centralTimer);
    res.send({
      status: "ok"
    });
  });

  app.get("/central/report/:client", async (req, res) => {
    const result = await db.central.findAll({
      where: {
        office: req.params.client
      }
    });
    res.send(result);
  });

  app.post(/\/client[1-2]/, (req, res) => {
    const client = req.url.match(/client[1-2]/)[0];
    logger.create(client);
    logger.print(`Client ${client} start work`);

    setInterval(async () => {
      logger.print(`${client} send request to sync`);
      await axios.put(`http://localhost:3000/central/report/${client}`);
    }, clientTimer);

    res.send({
      status: "ok"
    });
  });

  app.get(/\/client[1-2]\/report/, async (req, res) => {
    const result = await db[req.url.match(/client[1-2]/)[0]].findAll();
    res.send(result);
  });

  app.put("/central/report/:client", async (req, res) => {
    const client = req.params.client;
    await axios.get(`http://localhost:3000/${client}/report`).then((items) => {
      if (items.data) {
        items.data.forEach(async (item) => {
          delete item.id;

          const result = await db.central.update(item, {
            where: {
              office: client,
              department: item.department
            }
          });

          if (!result[0]) {
            item.office = client;
            await db.central.create(item);
          }
        });

        logger.print(
          `local ${client} sync with central`
        );
      }
    });
    res.send({
      status: "ok"
    });
  });

  return app;
};
