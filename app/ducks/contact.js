import {
    FETCH_CONTACT_BEGIN,
    FETCH_CONTACT_SUCCESS,
    FETCH_CONTACT_ERROR,
    FETCH_CONTACT_SORT_VALUE,
    FETCH_CONTACT_TOTAL_PAGE
  } from '../lib/actions/contact'
  
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
      case FETCH_CONTACT_BEGIN:
        return {
          ...state,
          loading: true,
          error: null
        }
  
      case FETCH_CONTACT_SUCCESS:
        return {
          ...state,
          loading: false,
          items: action.contact
        }
  
      case FETCH_CONTACT_ERROR:
        return {
          ...state,
          loading: false,
          error: action.error,
          items: []
        }
  
      case FETCH_CONTACT_SORT_VALUE:
        return {
          ...state,
          sortBy: action.sortBy,
          sortType: action.sortType
        }
  
      case FETCH_CONTACT_TOTAL_PAGE:
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
  