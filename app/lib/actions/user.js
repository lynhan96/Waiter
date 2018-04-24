import request from 'request-promise'
import { SubmissionError } from 'redux-form'
import R from 'ramda'

import Navigator from 'lib/Navigator'
import { showNotification } from './showNotification'
import { makeRequestOptions } from '../requestHeader'

export const FETCH_USER_BEGIN = 'FETCH_USER_BEGIN'
export const FETCH_USER_END = 'FETCH_USER_END'
export const FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS'
export const FETCH_USER_ERROR = 'FETCH_USER_ERROR'
export const FETCH_USER_SORT_VALUE = 'FETCH_USER_SORT_VALUE'
export const FETCH_USER_TOTAL_PAGE = 'FETCH_USER_TOTAL_PAGE'

export const tableHeader = () => ([
  { 'fieldName': 'id', 'viewTitle': 'ID' },
  { 'fieldName': 'name', 'viewTitle': 'Tên' },
  { 'fieldName': 'email', 'viewTitle': 'Email' },
  { 'fieldName': 'phoneNumber', 'viewTitle': 'Số điện thoại' },
  { 'fieldName': 'gender', 'viewTitle': 'Giới tinh' }
])

export const viewLabelHeader = () => ([
  { 'fieldName': 'name', 'viewTitle': 'Tên' },
  { 'fieldName': 'email', 'viewTitle': 'Email' },
  { 'fieldName': 'phoneNumber', 'viewTitle': 'Số điện thoại' },
  { 'fieldName': 'birthday', 'viewTitle': 'Ngày sinh' },
  { 'fieldName': 'gender', 'viewTitle': 'Giới tinh' },
  { 'fieldName': 'createdAt', 'viewTitle': 'Ngày tạo dữ liệu' },
  { 'fieldName': 'updatedAt', 'viewTitle': 'Ngày cập nhập dữ liệu' }
])

export const editFieldInfo = () => ([
  { 'fieldName': 'name', 'viewTitle': 'Tên', isRequired: true, type: 'text' },
  { 'fieldName': 'email', 'viewTitle': 'Email', isRequired: true, type: 'email' },
  { 'fieldName': 'password', 'viewTitle': 'Password', isRequired: false, type: 'password' },
  { 'fieldName': 'phoneNumber', 'viewTitle': 'Số điện thoại', isRequired: true, type: 'number' },
  { 'fieldName': 'birthday', 'viewTitle': 'Ngày sinh', isRequired: false, type: 'datetime' },
  { 'fieldName': 'gender', 'viewTitle': 'Giới tinh', isRequired: true, type: 'select' }
])

export const selectFieldData = () => ({
  'gender': ['Nam', 'Nữ']
})

export const customSelectFieldData = () => ({
})

export const fetchUsersBegin = () => ({
  type: FETCH_USER_BEGIN
})

export const fetchUsersEnd = () => ({
  type: FETCH_USER_END
})

export const fetchUsersSuccess = foods => ({
  type: FETCH_USER_SUCCESS,
  items: foods
})

export const fetchUsersError = error => ({
  type: FETCH_USER_ERROR,
  error: error
})

export const fetchUsersSortValue = (fieldName, sortType) => ({
  type: FETCH_USER_SORT_VALUE,
  sortType: sortType,
  sortBy: fieldName
})

export const fetchUsersTotalPage = totalPage => ({
  type: FETCH_USER_TOTAL_PAGE,
  totalPage: totalPage
})

export const searchByKeyword = (event, dispatch) => {
  dispatch(fetchUsers({keyword: event.target.value}))
  dispatch(fetchUsersSortValue('id', 'AtoZ'))
}

export const changePagination = (offset, sortFieldName, sortType, dispatch) => {
  if (sortType === 'AtoZ') {
    dispatch(fetchUsers({sortBy: sortFieldName, sortDir: 'asc', offset: offset}))
  } else {
    dispatch(fetchUsers({sortBy: sortFieldName, sortDir: 'desc', offset: offset}))
  }
}

export const sortByKey = (datas, fieldName, currentFieldName, sortType, dispatch) => {
  dispatch(fetchUsersBegin())

  if (sortType === 'AtoZ' && fieldName === currentFieldName) {
    dispatch(fetchUsersSortValue(fieldName, 'ZtoA'))
    dispatch(fetchUsers({sortBy: fieldName, sortDir: 'desc'}))
  } else {
    dispatch(fetchUsersSortValue(fieldName, 'AtoZ'))
    dispatch(fetchUsers({sortBy: fieldName, sortDir: 'asc'}))
  }
}

export const fetchUsers = params => {
  return dispatch => {
    dispatch(fetchUsersBegin())
    request(makeRequestOptions(params, 'users')).then(body => {
      if (body.code === 401 || body.code === 400 || body.code === 414) {
        showNotification('topRight', 'error', 'Quá trình xác thực xảy ra lỗi!')
      } else {
        console.log(body.data);
        dispatch(fetchUsersSuccess(body.data.items))
        dispatch(fetchUsersTotalPage(body.data.totalPage))
      }
    })
    .catch(err => dispatch(fetchUsersError(err)))
  }
}

const updateUser = (params, url, itemData, values, dispatch, props) => {
  return new Promise((resolve) => {
    request(makeRequestOptions(params, url)).then(body => {
      if (body.code === 0) {
        props.items[props.itemIndex] = R.merge(itemData)(values)
        dispatch(fetchUsersSuccess(props.items))

        showNotification('topRight', 'success', 'Cập nhập dữ liệu thành công')
      } else if (body.code === 417) {
        showNotification('topRight', 'error', 'Dữ liệu không tồn tại')
      } else if (body.code === 401 || body.code === 400) {
        showNotification('topRight', 'error', 'Quá trình xác thực xảy ra lỗi!')
      } else if (body.code === 418) {
        showNotification('topRight', 'error', 'Email đã tồn tại trong hệ thống! Vui lòng nhập email khác!')
      } else {
        showNotification('topRight', 'error', 'Quá trình cập nhập dữ liệu xảy ra lỗi')
      }

      dispatch(fetchUsersEnd())
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
  })
}

export const editUser =
  (values, dispatch, props) => {
    const url = 'updateUser'
    const itemData = props.items[props.itemIndex]

    let params = R.merge({ userId: itemData.id })(values)

    dispatch(fetchUsersBegin())
    updateUser(params, url, itemData, values, dispatch, props)
  }

const createItem = (params, url, dispatch, props) => {
  return new Promise((resolve) => {
    request(makeRequestOptions(params, url)).then(body => {
      if (body.code === 0) {
        showNotification('topRight', 'success', 'Tạo dữ liệu thành công')
        Navigator.push('users')
      } else if (body.code === 401 || body.code === 400) {
        showNotification('topRight', 'error', 'Quá trình xác thực xảy ra lỗi!')
      } else if (body.code === 418) {
        showNotification('topRight', 'error', 'Email đã tồn tại trong hệ thống! Vui lòng nhập email khác!')
      } else {
        showNotification('topRight', 'error', 'Quá trình tạo dữ liệu xảy ra lỗi')
      }

      dispatch(fetchUsersEnd())
      return resolve
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
  })
}

export const createUser =
  (values, dispatch, props) => {
    const url = 'createUser'

    dispatch(fetchUsersBegin())
    createItem(values, url, dispatch, props)
  }

export const deleteUser = (dispatch, userId, itemIndex, currentAction) => {
  const url = 'deleteUser'

  return new Promise((resolve) => {
    request(makeRequestOptions({userId: userId}, url)).then(body => {
      if (body.code === 0) {
        if (currentAction === 'list') {
          dispatch(fetchUsers())
        } else {
          Navigator.push('users')
        }

        showNotification('topRight', 'info', 'Xóa dữ liệu thành công')
      } else if (body.code === 401 || body.code === 400) {
        showNotification('topRight', 'error', 'Quá trình xác thực xảy ra lỗi!')
      } else {
        showNotification('topRight', 'error', 'Quá trình xóa dữ liệu xảy ra lỗi')
      }

      return resolve
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
  })
}
