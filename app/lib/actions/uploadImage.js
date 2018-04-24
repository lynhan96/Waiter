import * as firebase from 'firebase'
import R from 'ramda'

export const uploadImage = (pictures, key, callback) => {
  let imageUrl = ''
  const storageRef = firebase.storage().ref(key + '.png')

  const base64result = R.split(',', pictures[key])

  storageRef.putString(base64result[1], 'base64').then(function(snapshot) {
    imageUrl = snapshot.downloadURL
    callback()
    return imageUrl
  })
}
