import { ADMIN_SIGNED_OUT } from 'ducks/admin'

export const CHANGE_MODAL_STATUS = 'CHANGE_MODAL_STATUS'

export const changeOrderModal = (value, value1) => dispatch => {
  dispatch({type: CHANGE_MODAL_STATUS, orderModal: value, cancelModal: value1})
}

const initialState = {
  orderModal: false,
  cancelModal: false
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_MODAL_STATUS:
      return {
        ...state,
        orderModal: action.orderModal,
        cancelModal: action.cancelModal
      }

    case ADMIN_SIGNED_OUT:
      return {...initialState}
    default:
      return state
  }
}

export default reducer
