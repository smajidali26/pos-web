import { all, fork } from 'redux-saga/effects';
import { authSaga } from './auth';
import { ordersSaga } from './orders/ordersSaga';
import { storesSaga } from './stores/storesSaga';
import { transfersSaga } from './interStoreTransfers/transfersSaga';
import loyaltySaga from './loyalty/loyaltySaga';
import analyticsSaga from './analytics/analyticsSaga';

/**
 * Root saga that combines all feature sagas
 */
export default function* rootSaga() {
  console.log('========================================');
  console.log('ROOT SAGA - Starting all watchers');
  console.log('========================================');

  yield all([
    fork(authSaga),
    fork(ordersSaga),
    fork(storesSaga),
    fork(transfersSaga),
    fork(loyaltySaga),
    fork(analyticsSaga),
    // Add other feature sagas here as needed
    // fork(productsSaga),
    // etc.
  ]);

  console.log('ROOT SAGA - All watchers registered');
}
