import {
  FETCH_FOOD_CATEGORIES_BEGIN,
  FETCH_FOOD_CATEGORIES_SUCCESS,
  FETCH_FOOD_CATEGORIES_ERROR,
  FETCH_FOOD_CATEGORIES_SORT_VALUE,
  FETCH_FOOD_CATEGORIES_TOTAL_PAGE
} from '../lib/actions/foodCategory'

import { ADMIN_SIGNED_OUT } from 'ducks/admin'

const initialState = {
  items: [],
  loading: false,
  error: null,
  totalPage: 0,
  sortBy: 'id',
  sortType: 'AtoZ'
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_FOOD_CATEGORIES_BEGIN:
      return {
        ...state,
        loading: true,
        error: null
      }

    case FETCH_FOOD_CATEGORIES_SUCCESS:
      return {
        ...state,
        loading: false,
        items: action.foodCategories
      }

    case FETCH_FOOD_CATEGORIES_ERROR:
      return {
        ...state,
        loading: false,
        error: action.error,
        items: []
      }

    case FETCH_FOOD_CATEGORIES_SORT_VALUE:
      return {
        ...state,
        sortBy: action.sortBy,
        sortType: action.sortType
      }

    case FETCH_FOOD_CATEGORIES_TOTAL_PAGE:
      return {
        ...state,
        totalPage: action.totalPage
      }

    case ADMIN_SIGNED_OUT:
      return {...initialState}
    default:
      return state
  }
}

export default reducer
