import {
  FETCH_USER_BEGIN,
  FETCH_USER_SUCCESS,
  FETCH_USER_ERROR,
  FETCH_USER_SORT_VALUE,
  FETCH_USER_TOTAL_PAGE,
  FETCH_USER_END
} from 'lib/actions/user'

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
    case FETCH_USER_BEGIN:
      return {
        ...state,
        loading: true,
        error: null
      }

    case FETCH_USER_END:
      return {
        ...state,
        loading: false,
        error: null
      }

    case FETCH_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        items: action.items
      }

    case FETCH_USER_ERROR:
      return {
        ...state,
        loading: false,
        error: action.error,
        items: []
      }

    case FETCH_USER_SORT_VALUE:
      return {
        ...state,
        sortBy: action.sortBy,
        sortType: action.sortType
      }

    case FETCH_USER_TOTAL_PAGE:
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
