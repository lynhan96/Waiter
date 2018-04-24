import request from 'request-promise'
import { database } from 'database/database'
import { SubmissionError } from 'redux-form'
import R from 'ramda'

import { getAdminData, getOrderingState } from 'lib/Constant'
import Navigator from 'lib/Navigator'
import { showNotification } from './showNotification'
import { makeRequestOptions } from '../requestHeader'
import { sortObjectsByKeyAtoZ, sortObjectsByKeyZtoA } from 'lib/objects'

export const FETCH_ORDERING_BEGIN = 'FETCH_ORDERING_BEGIN'
export const FETCH_ORDERING_SUCCESS = 'FETCH_ORDERING_SUCCESS'
export const FETCH_ORDERING_ERROR = 'FETCH_ORDERING_ERROR'
export const FETCH_ORDERING_SORT_VALUE = 'FETCH_ORDERING_SORT_VALUE'
export const FETCH_ORDERING_TOTAL_PAGE = 'FETCH_ORDERING_TOTAL_PAGE'

export const tableHeader = () => ([
  { 'fieldName': 'id', 'viewTitle': 'ID' },
  { 'fieldName': 'transactionId', 'viewTitle': 'Mã hóa đơn' },
  { 'fieldName': 'status', 'viewTitle': 'Trạng thái' },
  { 'fieldName': 'userName', 'viewTitle': 'Khách hàng' },
  { 'fieldName': 'totalPrice', 'viewTitle': 'Tổng tiền' },
  { 'fieldName': 'createdAt', 'viewTitle': 'Thời gian' }
])

export const viewLabelHeader = () => ([
])

export const editFieldInfo = () => ([
])

export const selectFieldData = () => ({
})

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

export const fetchOrderingsSortValue = (fieldName, sortType) => ({
  type: FETCH_ORDERING_SORT_VALUE,
  sortType: sortType,
  sortBy: fieldName
})

export const fetchOrderingsTotalPage = totalPage => ({
  type: FETCH_ORDERING_TOTAL_PAGE,
  totalPage: totalPage
})

export const searchByKeyword = (event, dispatch) => {
  dispatch(fetchOrderings({keyword: event.target.value}))
  dispatch(fetchOrderingsSortValue('id', 'AtoZ'))
}

export const changePagination = (offset, sortFieldName, sortType, dispatch) => {
  if (sortType === 'AtoZ') {
    dispatch(fetchOrderings({sortBy: sortFieldName, sortDir: 'asc', offset: offset}))
  } else {
    dispatch(fetchOrderings({sortBy: sortFieldName, sortDir: 'desc', offset: offset}))
  }
}

export const sortByKey = (datas, fieldName, currentFieldName, sortType, dispatch) => {
  dispatch(fetchOrderingsBegin())

  if (sortType === 'AtoZ' && fieldName === currentFieldName) {
    dispatch(fetchOrderingsSortValue(fieldName, 'ZtoA'))
  } else {
    dispatch(fetchOrderingsSortValue(fieldName, 'AtoZ'))
  }

  dispatch(fetchOrderings())
}

const makeOrderingData = (datas, state, params) => {
  let offset = 0
  if (params && params.offset) {
    offset = params.offset
  }

  if (state.sortType === 'AtoZ') {
    return sortObjectsByKeyAtoZ(datas, state.sortBy, offset, 50)
  }

  return sortObjectsByKeyZtoA(datas, state.sortBy, offset, 50)
}

export const fetchOrderings = params => {
  return dispatch => {
    dispatch(fetchOrderingsBegin())
    const orderingState = getOrderingState()

    const ref = database.ref(getAdminData().vid + '/orders')

    ref.once('value')
      .then((snapshot) => {
        dispatch(fetchOrderingsTotalPage(R.values(snapshot.val()).length / 50))
        dispatch(fetchOrderingsSuccess(makeOrderingData(snapshot.val(), orderingState, params)))
      })
      .then(() => {
        ref.on('value', (result) => {
          dispatch(fetchOrderingsTotalPage(R.values(result.val()).length / 50))
          dispatch(fetchOrderingsSuccess(makeOrderingData(result.val(), orderingState, params)))
        })
      })
      .catch((error) => console.log(error))
  }
}

export const editEmployee =
  (values, dispatch, props) => {
    const url = 'updateEmployee'
    const itemData = props.items[props.itemIndex]

    const params = R.merge({ employeeId: itemData.id })(values)

    return request(makeRequestOptions(params, url)).then(body => {
      if (body.code === 0) {
        props.items[props.itemIndex] = R.merge(itemData)(values)
        dispatch(fetchOrderingsSuccess(props.items))

        showNotification('topRight', 'success', 'Cập nhập dữ liệu thành công')
      } else if (body.code === 417) {
        showNotification('topRight', 'error', 'Dữ liệu không tồn tại')
      } else if (body.code === 401 || body.code === 400) {
        showNotification('topRight', 'error', 'Quá trình xác thực xảy ra lỗi!')
      } else {
        showNotification('topRight', 'error', 'Quá trình cập nhập dữ liệu xảy ra lỗi')
      }
    })
    .catch(function (err) {
      if (err.message) {
        showNotification('topRight', 'error', err.message)
        throw new SubmissionError({ _error: err.message })
      } else {
        showNotification('topRight', 'error', JSON.stringify(err))
        throw new SubmissionError({ _error: JSON.stringify(err) })
      }
    })
  }

export const createEmployee =
  (values, dispatch, props) => {
    const url = 'createEmployee'

    return request(makeRequestOptions(values, url)).then(body => {
      if (body.code === 0) {
        showNotification('topRight', 'success', 'Tạo dữ liệu thành công')
        Navigator.push('employees')
      } else if (body.code === 401 || body.code === 400) {
        showNotification('topRight', 'error', 'Quá trình xác thực xảy ra lỗi!')
      } else {
        showNotification('topRight', 'error', 'Quá trình tạo dữ liệu xảy ra lỗi')
      }

      return Promise.resolve()
    })
    .catch(function (err) {
      if (err.message) {
        showNotification('topRight', 'error', err.message)
        throw new SubmissionError({ _error: err.message })
      } else {
        showNotification('topRight', 'error', JSON.stringify(err))
        throw new SubmissionError({ _error: JSON.stringify(err) })
      }
    })
  }

export const deleteOrdering = (dispatch, orderingId, itemIndex, currentAction) => {
  return new Promise((resolve) => {
    const ref = database.ref(getAdminData().vid + '/orders').child(orderingId)
    ref.remove()

    Navigator.push('orderings')

    showNotification('topRight', 'info', 'Xóa dữ liệu thành công')
  })
}
