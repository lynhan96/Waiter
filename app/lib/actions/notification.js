import { database } from 'database/database'
import R from 'ramda'
import { getAdminData } from 'lib/Constant'
import * as firebase from 'firebase'

export const FETCH_NOTIFICATION_SUCCESS = 'FETCH_NOTIFICATION_SUCCESS'
export const NOTIFICATION_CHANGED = 'NOTIFICATION_CHANGED'

export const fetchNotificationSuccess = data => ({
  type: FETCH_NOTIFICATION_SUCCESS,
  data
})

export const fetchNotifications = () => (dispatch) => {
  const ref = firebase.database().ref(getAdminData().vid + '/notifications/')

  ref.orderByChild('type').equalTo('waiter').on('value', (result) => {
    dispatch(fetchNotificationSuccess(result.val()))
  })

  // ref.orderByChild('type').equalTo('waiter').once('value')
  //   .then((snapshot) => {
  //     console.log(snapshot)
  //     const notificaitons = snapshot.val()

  //     dispatch(fetchNotificationSuccess(notificaitons))
  //   })
  //   .then(() => {
  //     ref.on('value', (result) => {
  //       dispatch(fetchNotificationSuccess(result.val()))
  //     })

  //   })
  //   .catch((error) => console.log(error))
}
