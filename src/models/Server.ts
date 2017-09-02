import * as Koa from 'koa';
import * as fs from 'mz/fs';
import * as path from 'path';
import winston = require('winston');
import koaLogger = require('koa-logger-winston');
import { createKoaServer } from 'routing-controllers';
import { Service } from 'typedi';

@Service()
export default class Server {

  private server: Koa;

  public async start() {
    const controllers = await this.loadControllers();
    this.server = createKoaServer({
        controllers,
    });

    const listenPort = 27345;

    this.server.listen(listenPort);
    this.server.use(koaLogger(winston));

    winston.info(`HTTP server listening at on port ${listenPort}`);
  }

  private async loadControllers(): Promise<Function[]> {
    const controllersDirectory = path.join(__dirname, '../controllers');

    const controllerFiles = await fs.readdir(controllersDirectory);

    return controllerFiles.map((controllerFile) => {
      const fullPath = path.join(controllersDirectory, controllerFile);
      return require(fullPath).default;
    });
  }

}
