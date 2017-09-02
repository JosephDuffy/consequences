import { Inject, Service } from 'typedi';
import winston = require('winston');

import AddonsManager from './AddonsManager';
import Server from './Server';

@Service()
export default class Core {

  @Inject()
  private server: Server;

  @Inject()
  private addonsManager: AddonsManager;

  public async start() {
    winston.info('Consequences core starting');

    await this.addonsManager.loadAddons();

    await this.server.start();
  }

}
