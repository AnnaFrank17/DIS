const config = require("./config");
const content = require("./content");
const db = require("./context");
const server = require("./server")(db);
const portscanner = require("portscanner");

(async function() {
  await db.sequelizeCentral.sync({ force: true });
  await db.sequelizeClient1.sync({ force: true });
  await db.sequelizeClient2.sync({ force: true });

  await db.client1.bulkCreate(content.client1);
  await db.client2.bulkCreate(content.client2);

  const listener = server.listen(3000, () => {
    console.log(`Server listening at 3000`);
  });
})();
