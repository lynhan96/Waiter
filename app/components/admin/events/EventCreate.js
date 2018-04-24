import React, {Component} from 'react'
import R from 'ramda'
import { connect } from 'react-redux'

import ContentLoading from 'components/ContentLoading'
import { isAdmin } from 'components/wrappers/isAdmin'
import { editFieldInfo, selectFieldData, customSelectFieldData } from '../../../lib/actions/event'
import { createEvent } from 'lib/actions/event'
import TableCreateItem from 'components/admin/table/TableCreateItem'

class EventCreate extends Component {
  render() {
    const { loading, dispatch } = this.props

    if (loading) {
      return (
        <ContentLoading
          message='Đang Cập nhập dữ liệu ...'
        />
      )
    }

    return (
      <div className='content'>
        <div className='container-fluid animated fadeIn'>
          <TableCreateItem
            editFieldInfo={editFieldInfo()}
            selectFieldData={selectFieldData()}
            customSelectFieldData={customSelectFieldData()}
            editHeader='Thêm Sự kiện'
            subHeader=''
            submitCreate={createEvent}
            arrLink={{ list: 'events' }}
            dispatch={dispatch}
          />
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  loading: state.event.loading,
  error: state.event.error
})

export default R.pipe(
  connect(mapStateToProps),
  isAdmin
)(EventCreate)
