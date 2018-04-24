import { database } from 'database/database'
import R from 'ramda'
import async from 'async'
import * as firebase from 'firebase'

import Navigator from 'lib/Navigator'
import { getAdminData } from 'lib/Constant'
import { showNotification } from './showNotification'

export const FETCH_ZONE_SUCCESS = 'FETCH_ZONE_SUCCESS'
export const ZONE_CHANGED = 'ZONE_CHANGED'
export const FETCH_ZONE_BEGIN = 'FETCH_ZONE_BEGIN'
export const ZONE_DELETED = 'ZONE_DELETED'

export const fetchZonesBegin = () => ({
  type: FETCH_ZONE_BEGIN
})

export const fetchZoneSuccess = items => ({
  type: FETCH_ZONE_SUCCESS,
  items: items
})

const createZone = params => {
  firebase.database().ref(getAdminData().vid + '/zones/').push({
    name: params.name,
    imageUrl: params.imageUrl
  })

  showNotification('topRight', 'success', 'Thêm khu vực thành công!')

  Navigator.push('map-tables')
}

export const submitAddZone =
  (values, dispatch, props) => {
    let params = values

    if (params.imageUrl) {
      dispatch(fetchZonesBegin())
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
          createZone(params)
        }
      })
    } else {
      dispatch(fetchZonesBegin())
      createZone(params)
    }
  }

export const fetchZones = () => (dispatch) => {
  const ref = database.ref(getAdminData().vid + '/zones')
  ref.once('value')
    .then((snapshot) => {
      const zones = snapshot.val()

      dispatch(fetchZoneSuccess(zones))
    })
    .then(() => {
      ref.on('value', (result) => dispatch(fetchZoneSuccess(result.val())))
      ref.on('child_removed', (result) => dispatch({ type: ZONE_DELETED, item: R.assoc('id', result.key, result.val()) }))
    })
    .catch((error) => console.log(error))
}
