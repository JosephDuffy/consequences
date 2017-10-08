import 'reflect-metadata';
import { useContainer } from 'routing-controllers';
import { Container } from 'typedi';
import Core from './models/Core';

useContainer(Container);

(async () => {
  const core = Container.get(Core);
  await core.start();
})();
