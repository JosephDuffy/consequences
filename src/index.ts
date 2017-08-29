import Server from './models/Server';

(async () => {
  const server = new Server();
  await server.start();
})();
