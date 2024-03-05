import { chainAllTheseAsyncFunctions } from './chaining-async-functions-that-return-async-try';
import { chainAllTheseFunctions } from './chaining-functions-that-return-try';
import { printRocketNameOfLatestLaunch } from './get-latest-space-x-rocket';
import { skippingALotOfFunctionalityOnFailure } from './skipping-a-lot-of-functionality-on-failure';
import { doSomeTransformations } from './transformations';

(async (): Promise<void> => {
  console.log('Getting the SpaceX rocket name of the latest launch...');
  await printRocketNameOfLatestLaunch().get();

  console.log('Doing a bunch of transformations...');
  doSomeTransformations().get();

  console.log('We can also chain functions that return a Try...');
  chainAllTheseFunctions();

  console.log('We can also chain async functions that return an AsyncTry...');
  await chainAllTheseAsyncFunctions();

  console.log(
    'When a Try or an AsyncTry is a failure, all subsequent operations are skipped...'
  );
  await skippingALotOfFunctionalityOnFailure();
})();
