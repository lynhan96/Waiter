import { database } from 'database/database'
import R from 'ramda'
import { getAdminData, getNotificationState } from 'lib/Constant'
import * as firebase from 'firebase'

export const FETCH_NOTIFICATION_SUCCESS = 'FETCH_NOTIFICATION_SUCCESS'
export const NOTIFICATION_CHANGED = 'NOTIFICATION_CHANGED'

export const fetchNotificationSuccess = items => ({
  type: FETCH_NOTIFICATION_SUCCESS,
  items
})

export const fetchNotifications = () => (dispatch) => {
  const ref = firebase.database().ref(getAdminData().vid + '/notifications/')

  ref.orderByChild('type').equalTo('waiter').on('value', (result) => {
    dispatch(fetchNotificationSuccess(result.val()))
  })
}

export const markReadMessage = (messageId) => (dispatch) => {
  const notifications = getNotificationState().items
  let currentNotification = notifications[messageId]
  currentNotification.read = 'yes'

  firebase.database().ref(getAdminData().vid + '/notifications/').child(messageId).set(currentNotification)
}
