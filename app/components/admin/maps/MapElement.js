import React, { Component } from 'react'
import { Link } from 'react-router'
import R from 'ramda'
import 'styles/website.less'

import { isAdmin } from 'components/wrappers/isAdmin'
import Draggable from 'react-draggable'
import { updateCoordinates, deleteTable } from 'lib/actions/table'

class MapElement extends Component {
  constructor (props) {
    super(props)
    this.onClick = this.onClick.bind(this)
    this.handleStop = this.handleStop.bind(this)
    this.deleteTable = this.deleteTable.bind(this)
  }

  onClick (event) {
  }

  deleteTable() {
    this.props.dispatch(deleteTable(this.props.id))
  }

  handleStop (e, data) {
    let { item, id } = this.props
    item.x = data.x
    item.y = data.y

    this.props.dispatch(updateCoordinates(item, id))
  }

  render() {
    const { item, id } = this.props
    const imageUrl = R.values(item.imageUrl)[0]

    return (
      <Draggable
        allowAnyClick={true}
        axis='both'
        handle='.handle'
        bounds='parent'
        defaultPosition={{x: item.x, y: item.y}}
        grid={[5, 5]}
        onStart={this.handleStart}
        onDrag={this.handleDrag}
        onStop={this.handleStop}>
        <div className='table handle'>
          <Link to='#' onClick={e => { e.preventDefault(); this.deleteTable() }} style={{ float: 'right', position: 'absolute', marginLeft: '20px' }}>
            <img src='images/delete.png' style={{ marginTop: '45px', width: '25px', height: '25px' }} />
          </Link>
          <div style={{ backgroundImage: 'url("' + imageUrl + '")', backgroundSize: 'cover' }} className='table-wrapper'>
            <Link to={'/edit-table-information?id=' + id}>
              <div className='table-name'>{item.name}</div>
              <div className='table-status'>{item.status}</div>
            </Link>
          </div>
        </div>
      </Draggable>
    )
  }
}

export default R.pipe(
  isAdmin
)(MapElement)
