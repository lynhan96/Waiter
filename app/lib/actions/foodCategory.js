import request from 'request-promise'
import async from 'async'
import { SubmissionError } from 'redux-form'
import * as firebase from 'firebase'
import R from 'ramda'

import Navigator from 'lib/Navigator'
import { showNotification } from './showNotification'
import { makeRequestOptions } from '../requestHeader'

export const FETCH_FOOD_CATEGORIES_BEGIN = 'FETCH_FOOD_CATEGORIES_BEGIN'
export const FETCH_FOOD_CATEGORIES_SUCCESS = 'FETCH_FOOD_CATEGORIES_SUCCESS'
export const FETCH_FOOD_CATEGORIES_ERROR = 'FETCH_FOOD_CATEGORIES_ERROR'
export const FETCH_FOOD_CATEGORIES_SORT_VALUE = 'FETCH_FOOD_CATEGORIES_SORT_VALUE'
export const FETCH_FOOD_CATEGORIES_TOTAL_PAGE = 'FETCH_FOOD_CATEGORIES_TOTAL_PAGE'

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

export const fetchFoodCategoriesBegin = () => ({
  type: FETCH_FOOD_CATEGORIES_BEGIN
})

export const fetchFoodCategoriesSuccess = foodCategories => ({
  type: FETCH_FOOD_CATEGORIES_SUCCESS,
  foodCategories: foodCategories
})

export const fetchFoodCategoriesError = error => ({
  type: FETCH_FOOD_CATEGORIES_ERROR,
  error: error
})

export const fetchFoodCategoriesSortValue = (fieldName, sortType) => ({
  type: FETCH_FOOD_CATEGORIES_SORT_VALUE,
  sortType: sortType,
  sortBy: fieldName
})

export const fetchFoodCategoriesTotalPage = totalPage => ({
  type: FETCH_FOOD_CATEGORIES_TOTAL_PAGE,
  totalPage: totalPage
})

export const searchByKeyword = (event, dispatch) => {
  dispatch(fetchFoodCategories({keyword: event.target.value}))
  dispatch(fetchFoodCategoriesSortValue('id', 'AtoZ'))
}

export const changePagination = (offset, sortFieldName, sortType, dispatch) => {
  if (sortType === 'AtoZ') {
    dispatch(fetchFoodCategories({sortBy: sortFieldName, sortDir: 'asc', offset: offset}))
  } else {
    dispatch(fetchFoodCategories({sortBy: sortFieldName, sortDir: 'desc', offset: offset}))
  }
}

export const sortByKey = (datas, fieldName, currentFieldName, sortType, dispatch) => {
  dispatch(fetchFoodCategoriesBegin())

  if (sortType === 'AtoZ' && fieldName === currentFieldName) {
    dispatch(fetchFoodCategoriesSortValue(fieldName, 'ZtoA'))
    dispatch(fetchFoodCategories({sortBy: fieldName, sortDir: 'desc'}))
  } else {
    dispatch(fetchFoodCategoriesSortValue(fieldName, 'AtoZ'))
    dispatch(fetchFoodCategories({sortBy: fieldName, sortDir: 'asc'}))
  }
}

export const fetchFoodCategories = params => {
  return dispatch => {
    dispatch(fetchFoodCategoriesBegin())
    request(makeRequestOptions(params, 'foodCategories')).then(body => {
      if (body.code === 401 || body.code === 400 || body.code === 414) {
        showNotification('topRight', 'error', 'Quá trình xác thực xảy ra lỗi!')
      } else {
        console.log(body.data);
        dispatch(fetchFoodCategoriesSuccess(body.data.items))
        dispatch(fetchFoodCategoriesTotalPage(body.data.totalPage))
      }
    })
    .catch(err => dispatch(fetchFoodCategoriesError(err)))
  }
}

const updateFoodCategory = (params, url, itemData, values, dispatch, props) => {
  return new Promise((resolve) => {
    request(makeRequestOptions(params, url)).then(body => {
      if (body.code === 0) {
        props.items[props.itemIndex] = R.merge(itemData)(values)
        dispatch(fetchFoodCategoriesSuccess(props.items))

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

export const editFoodCategory =
  (values, dispatch, props) => {
    const url = 'updateFoodCategory'
    const itemData = props.items[props.itemIndex]

    let params = R.merge({ foodCategoryId: itemData.id })(values)

    if (params.imageUrl) {
      dispatch(fetchFoodCategoriesBegin())
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
          updateFoodCategory(params, url, itemData, values, dispatch, props)
        }
      })
    } else {
      dispatch(fetchFoodCategoriesBegin())
      updateFoodCategory(params, url, itemData, values, dispatch, props)
    }
  }

const createItem = (params, url, dispatch, props) => {
  return new Promise((resolve) => {
    request(makeRequestOptions(params, url)).then(body => {
      if (body.code === 0) {
        showNotification('topRight', 'success', 'Tạo dữ liệu thành công')
        Navigator.push('food-categories')
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

export const createFoodCategory =
  (values, dispatch, props) => {
    const url = 'createFoodCategory'
    let params = values
    if (params.imageUrl) {
      dispatch(fetchFoodCategoriesBegin())
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
      dispatch(fetchFoodCategoriesBegin())
      createItem(params, url, dispatch, props)
    }
  }

export const deleteFoodCategory = (dispatch, foodCategoryId, itemIndex, currentAction) => {
  const url = 'deleteFoodCategory'

  return new Promise((resolve) => {
    request(makeRequestOptions({foodCategoryId: foodCategoryId}, url)).then(body => {
      if (body.code === 0) {
        if (currentAction === 'list') {
          dispatch(fetchFoodCategories())
        } else {
          Navigator.push('food-categories')
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
