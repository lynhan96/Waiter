import React, {Component} from 'react'
import Notification from 'react-web-notification'
import { connect } from 'react-redux'
import R from 'ramda'
import { isAdmin } from 'components/wrappers/isAdmin'
import { resetWebBrowserNotification } from 'ducks/webBrowserNotification'

class WebBrowserNotification extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ignore: true,
      title: ''
    }
  }

  handlePermissionGranted() {
    console.log('Permission Granted')
    this.setState({
      ignore: false
    })
  }
  handlePermissionDenied() {
    console.log('Permission Denied')
    this.setState({
      ignore: true
    })
  }
  handleNotSupported() {
    console.log('Web Notification not Supported')
    this.setState({
      ignore: true
    })
  }

  handleNotificationOnClick(e, tag) {
    console.log(e, 'Notification clicked tag:' + tag)
  }

  handleNotificationOnError(e, tag) {
    console.log(e, 'Notification error tag:' + tag)
  }

  handleNotificationOnClose(e, tag) {
    console.log(e, 'Notification closed tag:' + tag)
  }

  handleNotificationOnShow(e, tag) {
    this.playSound()
    console.log(e, 'Notification shown tag:' + tag)
    console.log('123123')
    this.props.dispatch(resetWebBrowserNotification())
  }

  playSound(filename) {
    document.getElementById('sound').play()
  }

  render() {
    const { options, ignore, title } = this.props

    return (
      <div>
        <Notification
          ignore={ignore && title !== ''}
          notSupported={this.handleNotSupported.bind(this)}
          onPermissionGranted={this.handlePermissionGranted.bind(this)}
          onPermissionDenied={this.handlePermissionDenied.bind(this)}
          onShow={this.handleNotificationOnShow.bind(this)}
          onClick={this.handleNotificationOnClick.bind(this)}
          onClose={this.handleNotificationOnClose.bind(this)}
          onError={this.handleNotificationOnError.bind(this)}
          timeout={5000}
          title={title}
          options={options}
        />
        <audio id='sound' preload='auto'>
          <source src='sound/sound.mp3' type='audio/mpeg' />
          <source src='sound/sound.ogg' type='audio/ogg' />
          <embed hidden='true' loop='false' src='sound/sound.mp3' />
        </audio>
      </div>
    )
  }
}

const mapStateToProps = state => state.webBrowserNotification

export default R.pipe(
  isAdmin,
  connect(mapStateToProps)
)(WebBrowserNotification)
