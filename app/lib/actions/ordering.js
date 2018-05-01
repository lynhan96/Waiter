import { database } from 'database/database'
import R from 'ramda'
import { getAdminData, getOrderingState, getTableState } from 'lib/Constant'
import * as firebase from 'firebase'
import { showNotification } from './showNotification'

export const FETCH_ORDERING_BEGIN = 'FETCH_ORDERING_BEGIN'
export const FETCH_ORDERING_SUCCESS = 'FETCH_ORDERING_SUCCESS'
export const FETCH_ORDERING_ERROR = 'FETCH_ORDERING_ERROR'

export const fetchOrderingsBegin = () => ({
  type: FETCH_ORDERING_BEGIN
})

export const fetchOrderingsSuccess = items => ({
  type: FETCH_ORDERING_SUCCESS,
  items: items
})

export const fetchOrderingsError = error => ({
  type: FETCH_ORDERING_ERROR,
  error: error
})

export const fetchOrderings = params => {
  return dispatch => {
    dispatch(fetchOrderingsBegin())
    const ref = database.ref(getAdminData().vid + '/orders')
    ref.once('value')
      .then((snapshot) => {
        dispatch(fetchOrderingsSuccess(snapshot.val()))
      })
      .then(() => {
        ref.on('value', (result) => {
          dispatch(fetchOrderingsSuccess(result.val()))
        })
      })
      .catch((error) => console.log(error))
  }
}

export const sendRequest = (tableId, orderingId) => {
  return dispatch => {
    const tableData = getTableState().items
    const currentTable = tableData[tableId]

    const notificationId = firebase.database().ref(getAdminData().vid + '/notifications/').push().key

    firebase.database().ref(getAdminData().vid + '/notifications/').child(notificationId).set({
      id: notificationId,
      message: currentTable.name + ': yêu cầu thanh toán',
      type: 'cashier',
      orderingId: orderingId,
      tableId: tableId,
      requiredDeleteFood: 'no',
      foodIndex: '',
      read: 'no'
    })
    showNotification('topRight', 'success', 'Gửi yêu cầu thanh toán thành công')
    return null
  }
}

export const removeOrderFood = (orderingId, itemIndex) => {
  return dispatch => {
    const employeeData = getAdminData()
    const orderingData = getOrderingState().items
    const tableData = getTableState().items
    let currentOrder = orderingData[orderingId]

    if (currentOrder.items[itemIndex].status !== 'Hết món') {
      showNotification('topRight', 'warning', 'Món ăn đang được chuẩn bị. Vui lòng chờ phản hồi từ nhà bếp')

      const currentTable = tableData[currentOrder.tableId]
      const notificationId = firebase.database().ref(getAdminData().vid + '/notifications/').push().key

      firebase.database().ref(getAdminData().vid + '/notifications/').child(notificationId).set({
        id: notificationId,
        message: currentTable.name + ' yêu cầu được hủy món ăn ' + currentOrder.items[itemIndex].name,
        type: 'kitchen',
        orderingId: orderingId,
        tableId: currentOrder.tableId,
        requiredDeleteFood: 'yes',
        foodIndex: itemIndex,
        read: 'no'
      })

      return null
    }

    currentOrder.items = R.remove(itemIndex, 1)(currentOrder.items)

    const totalPrice = R.pipe(
      R.values,
      R.map(item => {
        if (item.status === 'Hết món') {
          return 0
        } else {
          return item.currentPrice * item.quantity
        }
      }),
      R.sum
    )(currentOrder.items)

    currentOrder.totalPrice = totalPrice

    firebase.database().ref(employeeData.vid + '/orders/').child(orderingId).set(currentOrder)

    dispatch(fetchOrderings())
  }
}
