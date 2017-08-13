import Server from './server/models/Server';

(async () => {
  const server = new Server();
  await server.start();
})();
