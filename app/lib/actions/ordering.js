import { database } from 'database/database'

import { getAdminData, getOrderingState } from 'lib/Constant'
import { sortObjectsByKeyAtoZ } from 'lib/objects'

export const FETCH_ORDERING_BEGIN = 'FETCH_ORDERING_BEGIN'
export const FETCH_ORDERING_SUCCESS = 'FETCH_ORDERING_SUCCESS'
export const FETCH_ORDERING_ERROR = 'FETCH_ORDERING_ERROR'

export const fetchOrderingsBegin = () => ({
  type: FETCH_ORDERING_BEGIN
})

export const fetchOrderingsSuccess = items => ({
  type: FETCH_ORDERING_SUCCESS,
  items: items
})

export const fetchOrderingsError = error => ({
  type: FETCH_ORDERING_ERROR,
  error: error
})

const makeOrderingData = (datas, state, params) => {
  return sortObjectsByKeyAtoZ(datas, state.sortBy, 0, 200)
}

export const fetchOrderings = params => {
  return dispatch => {
    dispatch(fetchOrderingsBegin())
    const orderingState = getOrderingState()

    const ref = database.ref(getAdminData().vid + '/orders')

    ref.once('value')
      .then((snapshot) => {
        dispatch(fetchOrderingsSuccess(makeOrderingData(snapshot.val(), orderingState, params)))
      })
      .then(() => {
        ref.on('value', (result) => {
          dispatch(fetchOrderingsSuccess(makeOrderingData(result.val(), orderingState, params)))
        })
      })
      .catch((error) => console.log(error))
  }
}
