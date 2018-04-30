import React, {Component} from 'react'
import R from 'ramda'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import Navigator from 'lib/Navigator'
import { markReadMessage } from 'lib/actions/notification'

class Header extends Component {
  constructor (props) {
    super(props)
    this.search = this.search.bind(this)
    this.readMessage = this.readMessage.bind(this)
  }

  search(event) {
    Navigator.push('search?keyword=' + event.target.value)
  }

  readMessage(redirectUrl, messageId) {
    this.props.dispatch(markReadMessage(messageId))

    Navigator.push(redirectUrl)
  }

  render() {
    const { signedIn, notifications } = this.props
    let notificationData = []
    let readMessage = 0

    if (notifications != null) {
      notificationData = R.values(notifications)
      readMessage = R.filter(item => item.read && item.read === 'no')(notificationData).length
    }

    if (signedIn) {
      return (
        <nav className='navbar navbar-transparent navbar-absolute fixed'>
          <div className='container-fluid'>
            <div className='navbar-header'>
              <button type='button' className='navbar-toggle' data-toggle='collapse'>
              <span className='sr-only'>Toggle navigation</span>
              <span className='icon-bar'></span>
              <span className='icon-bar'></span>
              <span className='icon-bar'></span>
              </button>
            </div>
            <div className='collapse navbar-collapse' style={{ background: 'white' }}>
              <ul className='nav navbar-nav navbar-right'>
                <li className='dropdown'>
                  <a href='#' className='dropdown-toggle' data-toggle='dropdown' aria-expanded="false">
                    <i className='material-icons'>notifications</i>
                    { readMessage > 0 ? <span className='notification'>{readMessage}</span> : ''}
                  </a>
                  <ul className='dropdown-menu'>
                    {notificationData.map((value, index) => {
                      if (!value.read || value.read === 'yes') return ''

                      let url = ''

                      if (value.tableId) {
                        url = '/tabe-order-detail?tableId=' + value.tableId
                      }

                      return (
                        <li key={index}>
                          <Link to='#' onClick={e => { e.preventDefault(); this.readMessage(url, value.id) }}>{value.message}</Link>
                        </li>
                      )
                    })}
                  </ul>
                </li>
              </ul>
              <div className="form-group" style={styles.search}>
                <input type="text" className="form-control" placeholder="Tìm kiếm món ăn" onChange={this.search}/>
              </div>
            </div>
          </div>
        </nav>
      )
    } else {
      return (<div/>)
    }
  }
}

const mapStateToProps = (state) => ({
  signedIn: state.admin.signedIn,
  notifications: state.notification.items
})

export default connect(mapStateToProps)(Header)

const styles = {
  search: {
    width: '70%',
    marginTop: '4px'
  }
}
