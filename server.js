const jsonServer = require('json-server');
const cors = require('cors'); // Belangrijk!
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(cors()); // Dit zorgt dat Vercel bij je data mag
server.use(middlewares);
server.use(router);

const port = process.env.PORT || 5000;
server.listen(port, () => {
    console.log(`JSON Server draait op poort ${port}`);
});