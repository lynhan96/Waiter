import {
  FETCH_EMPLOYEES_BEGIN,
  FETCH_EMPLOYEES_SUCCESS,
  FETCH_EMPLOYEES_ERROR,
  FETCH_EMPLOYEES_SORT_VALUE,
  FETCH_EMPLOYEES_TOTAL_PAGE
} from '../lib/actions/employee'

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
    case FETCH_EMPLOYEES_BEGIN:
      return {
        ...state,
        loading: true,
        error: null
      }

    case FETCH_EMPLOYEES_SUCCESS:
      return {
        ...state,
        loading: false,
        items: action.employees
      }

    case FETCH_EMPLOYEES_ERROR:
      return {
        ...state,
        loading: false,
        error: action.error,
        items: []
      }

    case FETCH_EMPLOYEES_SORT_VALUE:
      return {
        ...state,
        sortBy: action.sortBy,
        sortType: action.sortType
      }

    case FETCH_EMPLOYEES_TOTAL_PAGE:
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
