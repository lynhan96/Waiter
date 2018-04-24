import {
  FETCH_EVENTS_BEGIN,
  FETCH_EVENTS_SUCCESS,
  FETCH_EVENTS_ERROR,
  FETCH_EVENTS_SORT_VALUE,
  FETCH_EVENTS_TOTAL_PAGE
} from '../lib/actions/event'

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
    case FETCH_EVENTS_BEGIN:
      return {
        ...state,
        loading: true,
        error: null
      }

    case FETCH_EVENTS_SUCCESS:
      return {
        ...state,
        loading: false,
        items: action.events
      }

    case FETCH_EVENTS_ERROR:
      return {
        ...state,
        loading: false,
        error: action.error,
        items: []
      }

    case FETCH_EVENTS_SORT_VALUE:
      return {
        ...state,
        sortBy: action.sortBy,
        sortType: action.sortType
      }

    case FETCH_EVENTS_TOTAL_PAGE:
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
