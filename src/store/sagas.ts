import { all, fork } from 'redux-saga/effects';
import { authSaga } from './auth';
import { ordersSaga } from './orders/ordersSaga';

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
    // Add other feature sagas here as needed
    // fork(productsSaga),
    // etc.
  ]);

  console.log('ROOT SAGA - All watchers registered');
}
