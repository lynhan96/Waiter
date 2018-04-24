import request from 'request-promise'
import async from 'async'
import { SubmissionError } from 'redux-form'
import * as firebase from 'firebase'
import R from 'ramda'

import Navigator from 'lib/Navigator'
import { showNotification } from './showNotification'
import { makeRequestOptions } from '../requestHeader'

export const FETCH_FOOD_BEGIN = 'FETCH_FOOD_BEGIN'
export const FETCH_FOOD_SUCCESS = 'FETCH_FOOD_SUCCESS'
export const FETCH_FOOD_ERROR = 'FETCH_FOOD_ERROR'
export const FETCH_FOOD_SORT_VALUE = 'FETCH_FOOD_SORT_VALUE'
export const FETCH_FOOD_TOTAL_PAGE = 'FETCH_FOOD_TOTAL_PAGE'

export const tableHeader = () => ([
  { 'fieldName': 'id', 'viewTitle': 'ID' },
  { 'fieldName': 'name', 'viewTitle': 'Tên' },
  { 'fieldName': 'status', 'viewTitle': 'Trạng thái' },
  { 'fieldName': 'currentPrice', 'viewTitle': 'Gía hiện tại' },
  { 'fieldName': 'oldPrice', 'viewTitle': 'Gía cũ' },
  { 'fieldName': 'isView', 'viewTitle': 'Hiển thị trên Website' }
])

export const viewLabelHeader = () => ([
  { 'fieldName': 'name', 'viewTitle': 'Tên' },
  { 'fieldName': 'categoryName', 'viewTitle': 'Danh mục' },
  { 'fieldName': 'status', 'viewTitle': 'Trạng thái' },
  { 'fieldName': 'currentPrice', 'viewTitle': 'Gía hiện tại' },
  { 'fieldName': 'oldPrice', 'viewTitle': 'Gía cũ' },
  { 'fieldName': 'startDate', 'viewTitle': 'Ngày bắt đầu' },
  { 'fieldName': 'endDate', 'viewTitle': 'Ngày kết thúc' },
  { 'fieldName': 'createdAt', 'viewTitle': 'Ngày tạo dữ liệu' },
  { 'fieldName': 'updatedAt', 'viewTitle': 'Ngày cập nhập dữ liệu' },
  { 'fieldName': 'imageUrl', 'viewTitle': 'Hình ảnh' },
  { 'fieldName': 'description', 'viewTitle': 'Mô tả' }
])

export const editFieldInfo = () => ([
  { 'fieldName': 'name', 'viewTitle': 'Tên', isRequired: true, type: 'text' },
  { 'fieldName': 'isView', 'viewTitle': 'Hiển thị trên Website', isRequired: true, type: 'customSelect' },
  { 'fieldName': 'foodCategoryId', 'viewTitle': 'Danh mục', type: 'customSelect' },
  { 'fieldName': 'status', 'viewTitle': 'Trạng thái', type: 'select' },
  { 'fieldName': 'currentPrice', 'viewTitle': 'Gía hiện tại', type: 'number', isRequired: true },
  { 'fieldName': 'oldPrice', 'viewTitle': 'Gía cũ', type: 'number', isRequired: true },
  { 'fieldName': 'startDate', 'viewTitle': 'Ngày bắt đầu', type: 'datetime', isRequired: true },
  { 'fieldName': 'endDate', 'viewTitle': 'Ngày kết thúc', type: 'datetime', isRequired: true },
  { 'fieldName': 'imageUrl', 'viewTitle': 'Hình ảnh', isRequired: true, type: 'image' },
  { 'fieldName': 'description', 'viewTitle': 'Mô tả', isRequired: true, type: 'ckeditor' }
])

export const selectFieldData = () => ({
  'status': ['Còn Món', 'Hết Món']
})

export const customSelectFieldData = () => ({
  'isView': { value: [true, false], view: ['Có', 'Không'] }
})

export const fetchFoodsBegin = () => ({
  type: FETCH_FOOD_BEGIN
})

export const fetchFoodsSuccess = foods => ({
  type: FETCH_FOOD_SUCCESS,
  items: foods
})

export const fetchFoodsError = error => ({
  type: FETCH_FOOD_ERROR,
  error: error
})

export const fetchFoodsSortValue = (fieldName, sortType) => ({
  type: FETCH_FOOD_SORT_VALUE,
  sortType: sortType,
  sortBy: fieldName
})

export const fetchFoodsTotalPage = totalPage => ({
  type: FETCH_FOOD_TOTAL_PAGE,
  totalPage: totalPage
})

export const searchByKeyword = (event, dispatch) => {
  dispatch(fetchFoods({keyword: event.target.value}))
  dispatch(fetchFoodsSortValue('id', 'AtoZ'))
}

export const changePagination = (offset, sortFieldName, sortType, dispatch) => {
  if (sortType === 'AtoZ') {
    dispatch(fetchFoods({sortBy: sortFieldName, sortDir: 'asc', offset: offset}))
  } else {
    dispatch(fetchFoods({sortBy: sortFieldName, sortDir: 'desc', offset: offset}))
  }
}

export const sortByKey = (datas, fieldName, currentFieldName, sortType, dispatch) => {
  dispatch(fetchFoodsBegin())

  if (sortType === 'AtoZ' && fieldName === currentFieldName) {
    dispatch(fetchFoodsSortValue(fieldName, 'ZtoA'))
    dispatch(fetchFoods({sortBy: fieldName, sortDir: 'desc'}))
  } else {
    dispatch(fetchFoodsSortValue(fieldName, 'AtoZ'))
    dispatch(fetchFoods({sortBy: fieldName, sortDir: 'asc'}))
  }
}

export const fetchFoods = params => {
  return dispatch => {
    dispatch(fetchFoodsBegin())
    request(makeRequestOptions(params, 'foods')).then(body => {
      if (body.code === 401 || body.code === 400 || body.code === 414) {
        showNotification('topRight', 'error', 'Quá trình xác thực xảy ra lỗi!')
      } else {
        console.log(body.data);
        dispatch(fetchFoodsSuccess(body.data.items))
        dispatch(fetchFoodsTotalPage(body.data.totalPage))
      }
    })
    .catch(err => dispatch(fetchFoodsError(err)))
  }
}

const updateFood = (params, url, itemData, values, dispatch, props) => {
  return new Promise((resolve) => {
    request(makeRequestOptions(params, url)).then(body => {
      if (body.code === 0) {
        props.items[props.itemIndex] = R.merge(itemData)(values)
        dispatch(fetchFoodsSuccess(props.items))

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

export const editFood =
  (values, dispatch, props) => {
    const url = 'updateFood'
    const itemData = props.items[props.itemIndex]

    let params = R.merge({ foodId: itemData.id })(values)

    if (params.imageUrl) {
      dispatch(fetchFoodsBegin())
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
          updateFood(params, url, itemData, values, dispatch, props)
        }
      })
    } else {
      dispatch(fetchFoodsBegin())
      updateFood(params, url, itemData, values, dispatch, props)
    }
  }

const createItem = (params, url, dispatch, props) => {
  return new Promise((resolve) => {
    request(makeRequestOptions(params, url)).then(body => {
      if (body.code === 0) {
        showNotification('topRight', 'success', 'Tạo dữ liệu thành công')
        Navigator.push('foods')
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

export const createFood =
  (values, dispatch, props) => {
    const url = 'createFood'
    let params = values
    if (params.imageUrl) {
      dispatch(fetchFoodsBegin())
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
      dispatch(fetchFoodsBegin())
      createItem(params, url, dispatch, props)
    }
  }

export const deleteFood = (dispatch, foodId, itemIndex, currentAction) => {
  const url = 'deleteFood'

  return new Promise((resolve) => {
    request(makeRequestOptions({foodId: foodId}, url)).then(body => {
      if (body.code === 0) {
        if (currentAction === 'list') {
          dispatch(fetchFoods())
        } else {
          Navigator.push('foods')
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
