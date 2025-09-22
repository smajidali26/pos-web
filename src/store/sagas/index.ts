import { all, fork } from 'redux-saga/effects';
import { authSaga } from '../auth/saga';
import { cartSaga } from '../cart/saga';
import { productsSaga } from '../products/saga';

// Root saga
export default function* rootSaga() {
  yield all([
    fork(authSaga),
    fork(cartSaga),
    fork(productsSaga),
  ]);
}
