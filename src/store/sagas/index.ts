import { all, fork } from 'redux-saga/effects';
import { authSaga } from '../auth/saga';
import { cartSaga } from '../cart/saga';
import { productsSaga } from '../products/saga';
import { customersSaga } from '../customers/customersSaga';
import { ordersSaga } from '../orders/ordersSaga';
import { reportsSaga } from '../reports/reportsSaga';
import { employeeProfilesSaga } from '../employees/employeeProfilesSaga';
import { shiftsSaga } from '../employees/shiftsSaga';
import { commissionsSaga } from '../employees/commissionsSaga';
import { performanceSaga } from '../employees/performanceSaga';

// Root saga
export default function* rootSaga() {
  yield all([
    fork(authSaga),
    fork(cartSaga),
    fork(productsSaga),
    fork(customersSaga),
    fork(ordersSaga),
    fork(reportsSaga),
    fork(employeeProfilesSaga),
    fork(shiftsSaga),
    fork(commissionsSaga),
    fork(performanceSaga),
  ]);
}
