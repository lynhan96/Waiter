import React from 'react'
import R from 'ramda'
import ReactQueryParams from 'react-query-params'
import { connect } from 'react-redux'

import ErrorMessage from 'components/ErrorMessage'
import ContentLoading from 'components/ContentLoading'
import { isAdmin } from 'components/wrappers/isAdmin'
import { viewLabelHeader, deleteEvent } from '../../../lib/actions/event'
import TableViewItem from 'components/admin/table/TableViewItem'

class EventView extends ReactQueryParams {
  render() {
    const { error, loading, events, dispatch } = this.props
    const params = this.queryParams

    if (error) {
      return (
        <ContentLoading
          message='Quá trình tải dữ liệu xảy ra lỗi!'
        />
      )
    }

    if (loading) {
      return (
        <ContentLoading
          message='Đang tải dữ liệu ...'
        />
      )
    }

    return (
      <div className='content'>
        <div className='container-fluid animated fadeIn'>
          {error && <ErrorMessage text={error} />}
          <TableViewItem
            viewLabelHeader={viewLabelHeader()}
            viewHeader='Thông tin Sự kiện'
            arrLink={{ list: 'events', edit: 'event-edit' }}
            data={events[params.index]}
            subHeader={events[params.index].name}
            deleteItem={deleteEvent}
            itemIndex={params.index}
            items={events}
            dispatch={dispatch}
          />
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  events: state.event.items,
  loading: state.event.loading,
  error: state.event.error
})

export default R.pipe(
  connect(mapStateToProps),
  isAdmin
)(EventView)
