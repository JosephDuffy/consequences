import { Inject, Service } from 'typedi';
import winston = require('winston');

import AddonsManager from './AddonsManager';
import Database from './Database';
import Server from './Server';

@Service()
export default class Core {

  @Inject()
  private database: Database;

  @Inject()
  private server: Server;

  @Inject()
  private addonsManager: AddonsManager;

  public async start() {
    winston.info('Consequences core starting');

    await this.database.initialise();

    await this.addonsManager.loadAddons();

    await this.server.start();
  }

}
