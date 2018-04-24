import request from 'request-promise'
import { SubmissionError } from 'redux-form'
import R from 'ramda'

import Navigator from 'lib/Navigator'
import { showNotification } from './showNotification'
import { makeRequestOptions } from '../requestHeader'

export const FETCH_CONTACT_BEGIN = 'FETCH_CONTACT_BEGIN'
export const FETCH_CONTACT_SUCCESS = 'FETCH_CONTACT_SUCCESS'
export const FETCH_CONTACT_ERROR = 'FETCH_CONTACT_ERROR'
export const FETCH_CONTACT_SORT_VALUE = 'FETCH_CONTACT_SORT_VALUE'
export const FETCH_CONTACT_TOTAL_PAGE = 'FETCH_CONTACT_TOTAL_PAGE'

export const tableHeader = () => ([
    { 'fieldName': 'id', 'viewTitle': 'ID' },
    { 'fieldName': 'name', 'viewTitle': 'Tên' },
    { 'fieldName': 'email', 'viewTitle': 'Email' },
    { 'fieldName': 'phoneNumber', 'viewTitle': 'Số điện thoại' },
    { 'fieldName': 'address', 'viewTitle': 'Địa chỉ' },
	{ 'fieldName': 'message', 'viewTitle': 'Nội dung tin nhắn' },
    { 'fieldName': 'viewed', 'viewTitle': 'Đã xem' }
])

export const viewLabelHeader = () => ([
    { 'fieldName': 'id', 'viewTitle': 'ID' },
    { 'fieldName': 'name', 'viewTitle': 'Tên' },
    { 'fieldName': 'email', 'viewTitle': 'Email' },
    { 'fieldName': 'phoneNumber', 'viewTitle': 'Số điện thoại' },
    { 'fieldName': 'address', 'viewTitle': 'Địa chỉ' },
    { 'fieldName': 'viewed', 'viewTitle': 'Đã xem' },
    { 'fieldName': 'createdAt', 'viewTitle': 'Ngày tạo dữ liệu' },
    { 'fieldName': 'updatedAt', 'viewTitle': 'Ngày cập nhập dữ liệu' }
])

export const fetchContactBegin = () => ({
  type: FETCH_CONTACT_BEGIN
})

export const fetchContactSuccess = contact => ({
  type: FETCH_CONTACT_SUCCESS,
  contact: contact
})

export const fetchContactError = error => ({
  type: FETCH_CONTACT_SUCCESS,
  error: error
})

export const fetchContactSortValue = (fieldName, sortType) => ({
  type: FETCH_CONTACT_SORT_VALUE,
  sortType: sortType,
  sortBy: fieldName
})

export const fetchContactTotalPage = totalPage => ({
  type: FETCH_CONTACT_TOTAL_PAGE,
  totalPage: totalPage
})

export const searchByKeyword = (event, dispatch) => {
  dispatch(fetchContact({keyword: event.target.value}))
  dispatch(fetchContactSortValue('id', 'AtoZ'))
}

export const changePagination = (offset, sortFieldName, sortType, dispatch) => {
  if (sortType === 'AtoZ') {
    dispatch(fetchContact({sortBy: sortFieldName, sortDir: 'asc', offset: offset}))
  } else {
    dispatch(fetchContact({sortBy: sortFieldName, sortDir: 'desc', offset: offset}))
  }
}

export const sortByKey = (datas, fieldName, currentFieldName, sortType, dispatch) => {
  dispatch(fetchContactBegin())

  if (sortType === 'AtoZ' && fieldName === currentFieldName) {
    dispatch(fetchContactSortValue(fieldName, 'ZtoA'))
    dispatch(fetchContact({sortBy: fieldName, sortDir: 'desc'}))
  } else {
    dispatch(fetchContactSortValue(fieldName, 'AtoZ'))
    dispatch(fetchContact({sortBy: fieldName, sortDir: 'asc'}))
  }
}

export const fetchContact = params => {
  return dispatch => {
    dispatch(fetchContactBegin())
    request(makeRequestOptions(params, 'contacts')).then(body => {
      if (body.code === 401) {
        showNotification('topRight', 'error', 'Quá trình xác thực xảy ra lỗi!')
      } else {
        dispatch(fetchContactSuccess(body.data.items))
        dispatch(fetchContactTotalPage(body.data.totalPage))
      }
    })
      .catch(err => dispatch(fetchContactError(err)))
  }
}

export const deleteContact = (dispatch, contactId, itemIndex, currentAction) => {
  const url = 'deleteContact'

  return new Promise((resolve) => {
    request(makeRequestOptions({id: contactId}, url)).then(body => {
      if (body.code === 0) {
        if (currentAction === 'list') {
          dispatch(fetchContact())
        } else {
          Navigator.push('contacts')
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

export const seenContact = (dispatch, contactId, viewed, currentAction) => {
  const url = 'seenContact'

  return new Promise((resolve) => {
    request(makeRequestOptions({id: contactId, viewed: viewed}, url)).then(body => {
      if (body.code === 0) {
        if (currentAction === 'list') {
          dispatch(fetchContact())
        } else {
          Navigator.push('contacts')
        }

        showNotification('topRight', 'info', viewed ? 'Đã check là chưa xem' : 'Đã xem')
      } else if (body.code === 401 || body.code === 400) {
        showNotification('topRight', 'error', 'Quá trình xác thực xảy ra lỗi!')
      } else {
        showNotification('topRight', 'error', 'Quá trình thay đổi dữ liệu xảy ra lỗi')
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
