import request from 'request-promise'
import { SubmissionError } from 'redux-form'
import R from 'ramda'

import Navigator from 'lib/Navigator'
import { showNotification } from './showNotification'
import { makeRequestOptions } from '../requestHeader'

export const FETCH_EMPLOYEES_BEGIN = 'FETCH_EMPLOYEES_BEGIN'
export const FETCH_EMPLOYEES_SUCCESS = 'FETCH_EMPLOYEES_SUCCESS'
export const FETCH_EMPLOYEES_ERROR = 'FETCH_EMPLOYEES_ERROR'
export const FETCH_EMPLOYEES_SORT_VALUE = 'FETCH_EMPLOYEES_SORT_VALUE'
export const FETCH_EMPLOYEES_TOTAL_PAGE = 'FETCH_EMPLOYEES_TOTAL_PAGE'

export const tableHeader = () => ([
  { 'fieldName': 'id', 'viewTitle': 'ID' },
  { 'fieldName': 'name', 'viewTitle': 'Tên' },
  { 'fieldName': 'email', 'viewTitle': 'Email' },
  { 'fieldName': 'position', 'viewTitle': 'Vị trí' },
  { 'fieldName': 'phoneNumber', 'viewTitle': 'Số điện thoại' },
  { 'fieldName': 'gender', 'viewTitle': 'Giới tinh' }
])

export const viewLabelHeader = () => ([
  { 'fieldName': 'name', 'viewTitle': 'Tên' },
  { 'fieldName': 'email', 'viewTitle': 'Email' },
  { 'fieldName': 'position', 'viewTitle': 'Vị trí' },
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
  { 'fieldName': 'position', 'viewTitle': 'Vị trí', isRequired: true, type: 'select' },
  { 'fieldName': 'phoneNumber', 'viewTitle': 'Số điện thoại', isRequired: true, type: 'number' },
  { 'fieldName': 'birthday', 'viewTitle': 'Ngày sinh', isRequired: false, type: 'datetime' },
  { 'fieldName': 'gender', 'viewTitle': 'Giới tinh', isRequired: true, type: 'select' }
])

export const selectFieldData = () => ({
  'position': ['Nhân viên phục vụ', 'Quản trị viên', 'Nhân viên bếp', 'Nhân viên thu ngân'],
  'gender': ['Nam', 'Nữ']
})

export const fetchEmployeesBegin = () => ({
  type: FETCH_EMPLOYEES_BEGIN
})

export const fetchEmployeesSuccess = employees => ({
  type: FETCH_EMPLOYEES_SUCCESS,
  employees: employees
})

export const fetchEmployeesError = error => ({
  type: FETCH_EMPLOYEES_ERROR,
  error: error
})

export const fetchEmployeesSortValue = (fieldName, sortType) => ({
  type: FETCH_EMPLOYEES_SORT_VALUE,
  sortType: sortType,
  sortBy: fieldName
})

export const fetchEmployeesTotalPage = totalPage => ({
  type: FETCH_EMPLOYEES_TOTAL_PAGE,
  totalPage: totalPage
})

export const searchByKeyword = (event, dispatch) => {
  dispatch(fetchEmployees({keyword: event.target.value}))
  dispatch(fetchEmployeesSortValue('id', 'AtoZ'))
}

export const changePagination = (offset, sortFieldName, sortType, dispatch) => {
  if (sortType === 'AtoZ') {
    dispatch(fetchEmployees({sortBy: sortFieldName, sortDir: 'asc', offset: offset}))
  } else {
    dispatch(fetchEmployees({sortBy: sortFieldName, sortDir: 'desc', offset: offset}))
  }
}

export const sortByKey = (datas, fieldName, currentFieldName, sortType, dispatch) => {
  dispatch(fetchEmployeesBegin())

  if (sortType === 'AtoZ' && fieldName === currentFieldName) {
    dispatch(fetchEmployeesSortValue(fieldName, 'ZtoA'))
    dispatch(fetchEmployees({sortBy: fieldName, sortDir: 'desc'}))
  } else {
    dispatch(fetchEmployeesSortValue(fieldName, 'AtoZ'))
    dispatch(fetchEmployees({sortBy: fieldName, sortDir: 'asc'}))
  }
}

export const fetchEmployees = params => {
  return dispatch => {
    dispatch(fetchEmployeesBegin())
    request(makeRequestOptions(params, 'employees')).then(body => {
      if (body.code === 401) {
        showNotification('topRight', 'error', 'Quá trình xác thực xảy ra lỗi!')
      } else {
        console.log(body.data);
        
        dispatch(fetchEmployeesSuccess(body.data.items))
        dispatch(fetchEmployeesTotalPage(body.data.totalPage))
      }
    })
    .catch(err => dispatch(fetchEmployeesError(err)))
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
        dispatch(fetchEmployeesSuccess(props.items))

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

export const deleteEmployee = (dispatch, employeeId, itemIndex, currentAction) => {
  const url = 'deleteEmployee'

  return new Promise((resolve) => {
    request(makeRequestOptions({employeeId: employeeId}, url)).then(body => {
      if (body.code === 0) {
        if (currentAction === 'list') {
          dispatch(fetchEmployees())
        } else {
          Navigator.push('employees')
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
