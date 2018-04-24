import request from 'request-promise'
import async from 'async'
import { SubmissionError } from 'redux-form'
import * as firebase from 'firebase'
import R from 'ramda'

import Navigator from 'lib/Navigator'
import { showNotification } from './showNotification'
import { makeRequestOptions } from '../requestHeader'

export const FETCH_EVENT_BEGIN = 'FETCH_EVENT_BEGIN'
export const FETCH_EVENT_SUCCESS = 'FETCH_EVENT_SUCCESS'
export const FETCH_EVENT_ERROR = 'FETCH_EVENT_ERROR'
export const FETCH_EVENT_SORT_VALUE = 'FETCH_EVENT_SORT_VALUE'
export const FETCH_EVENT_TOTAL_PAGE = 'FETCH_EVENT_TOTAL_PAGE'

export const tableHeader = () => ([
  { 'fieldName': 'id', 'viewTitle': 'ID' },
  { 'fieldName': 'name', 'viewTitle': 'Tên' },
  { 'fieldName': 'imageUrl', 'viewTitle': 'Hình ảnh' },
  { 'fieldName': 'isView', 'viewTitle': 'Hiển thị trên Website' }
])

export const viewLabelHeader = () => ([
  { 'fieldName': 'name', 'viewTitle': 'Tên' },
  { 'fieldName': 'createdAt', 'viewTitle': 'Ngày tạo dữ liệu' },
  { 'fieldName': 'updatedAt', 'viewTitle': 'Ngày cập nhập dữ liệu' },
  { 'fieldName': 'imageUrl', 'viewTitle': 'Hình ảnh' },
  { 'fieldName': 'description', 'viewTitle': 'Mô tả' }
])

export const editFieldInfo = () => ([
  { 'fieldName': 'name', 'viewTitle': 'Tên', isRequired: true, type: 'text' },
  { 'fieldName': 'isView', 'viewTitle': 'Hiển thị trên Website', isRequired: true, type: 'customSelect' },
  { 'fieldName': 'imageUrl', 'viewTitle': 'Hình ảnh', isRequired: true, type: 'image' },
  { 'fieldName': 'description', 'viewTitle': 'Mô tả', isRequired: true, type: 'ckeditor' }
])

export const selectFieldData = () => ({
})

export const customSelectFieldData = () => ({
  'isView': { value: [true, false], view: ['Có', 'Không'] }
})

export const fetchEventsBegin = () => ({
  type: FETCH_EVENT_BEGIN
})

export const fetchEventsSuccess = events => ({
  type: FETCH_EVENT_SUCCESS,
  events: events
})

export const fetchEventsError = error => ({
  type: FETCH_EVENT_ERROR,
  error: error
})

export const fetchEventsSortValue = (fieldName, sortType) => ({
  type: FETCH_EVENT_SORT_VALUE,
  sortType: sortType,
  sortBy: fieldName
})

export const fetchEventsTotalPage = totalPage => ({
  type: FETCH_EVENT_TOTAL_PAGE,
  totalPage: totalPage
})

export const searchByKeyword = (event, dispatch) => {
  dispatch(fetchEvents({keyword: event.target.value}))
  dispatch(fetchEventsSortValue('id', 'AtoZ'))
}

export const changePagination = (offset, sortFieldName, sortType, dispatch) => {
  if (sortType === 'AtoZ') {
    dispatch(fetchEvents({sortBy: sortFieldName, sortDir: 'asc', offset: offset}))
  } else {
    dispatch(fetchEvents({sortBy: sortFieldName, sortDir: 'desc', offset: offset}))
  }
}

export const sortByKey = (datas, fieldName, currentFieldName, sortType, dispatch) => {
  dispatch(fetchEventsBegin())

  if (sortType === 'AtoZ' && fieldName === currentFieldName) {
    dispatch(fetchEventsSortValue(fieldName, 'ZtoA'))
    dispatch(fetchEvents({sortBy: fieldName, sortDir: 'desc'}))
  } else {
    dispatch(fetchEventsSortValue(fieldName, 'AtoZ'))
    dispatch(fetchEvents({sortBy: fieldName, sortDir: 'asc'}))
  }
}

export const fetchEvents = params => {
  return dispatch => {
    dispatch(fetchEventsBegin())
    request(makeRequestOptions(params, 'events')).then(body => {
      if (body.code === 401 || body.code === 400 || body.code === 414) {
        showNotification('topRight', 'error', 'Quá trình xác thực xảy ra lỗi!')
      } else {
        dispatch(fetchEventsSuccess(body.data.items))
        dispatch(fetchEventsTotalPage(body.data.totalPage))
      }
    })
    .catch(err => dispatch(fetchEventsError(err)))
  }
}

const updateEvent = (params, url, itemData, values, dispatch, props) => {
  return new Promise((resolve) => {
    request(makeRequestOptions(params, url)).then(body => {
      if (body.code === 0) {
        props.items[props.itemIndex] = R.merge(itemData)(values)
        dispatch(fetchEventsSuccess(props.items))

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
  })
}

export const editEvent =
  (values, dispatch, props) => {
    const url = 'updateEvent'
    const itemData = props.items[props.itemIndex]

    let params = R.merge({ eventId: itemData.id })(values)

    if (params.imageUrl) {
      dispatch(fetchEventsBegin())
      const keys = Object.keys(params.imageUrl)

      async.each(keys, function(key, callback) {
        const storageRef = firebase.storage().ref(key + '.png')
        const base64result = R.split(',', params.imageUrl[key])

        if (base64result.length === 1) {
          callback()
          return
        }

        storageRef.putString(base64result[1], 'base64').then(function(snapshot) {
          params.imageUrl[key] = snapshot.downloadURL
          callback()
        })
      }, function(err) {
        if (err) {
          showNotification('topRight', 'error', 'Quá trình Upload hình xảy ra lỗi!')
        } else {
          updateEvent(params, url, itemData, values, dispatch, props)
        }
      })
    } else {
      dispatch(fetchEventsBegin())
      updateEvent(params, url, itemData, values, dispatch, props)
    }
  }

const createItem = (params, url, dispatch, props) => {
  return new Promise((resolve) => {
    request(makeRequestOptions(params, url)).then(body => {
      if (body.code === 0) {
        showNotification('topRight', 'success', 'Tạo dữ liệu thành công')
        Navigator.push('events')
      } else if (body.code === 401 || body.code === 400) {
        showNotification('topRight', 'error', 'Quá trình xác thực xảy ra lỗi!')
      } else {
        showNotification('topRight', 'error', 'Quá trình tạo dữ liệu xảy ra lỗi')
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

export const createEvent =
  (values, dispatch, props) => {
    const url = 'createEvent'
    let params = values
    if (params.imageUrl) {
      dispatch(fetchEventsBegin())
      const keys = Object.keys(params.imageUrl)

      async.each(keys, function(key, callback) {
        const storageRef = firebase.storage().ref(key + '.png')
        const base64result = R.split(',', params.imageUrl[key])

        storageRef.putString(base64result[1], 'base64').then(function(snapshot) {
          params.imageUrl[key] = snapshot.downloadURL
          callback()
        })
      }, function(err) {
        if (err) {
          showNotification('topRight', 'error', 'Quá trình Upload hình xảy ra lỗi!')
        } else {
          createItem(params, url, dispatch, props)
        }
      })
    } else {
      dispatch(fetchEventsBegin())
      createItem(params, url, dispatch, props)
    }
  }

export const deleteEvent = (dispatch, eventId, itemIndex, currentAction) => {
  const url = 'deleteEvent'

  return new Promise((resolve) => {
    request(makeRequestOptions({eventId: eventId}, url)).then(body => {
      if (body.code === 0) {
        if (currentAction === 'list') {
          dispatch(fetchEvents())
        } else {
          Navigator.push('events')
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
