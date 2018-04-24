import React from 'react'
import R from 'ramda'
import ReactQueryParams from 'react-query-params'
import { connect } from 'react-redux'

import { isAdmin } from 'components/wrappers/isAdmin'
import { tableHeader, fetchEvents, deleteEvent, sortByKey, searchByKeyword, changePagination } from 'lib/actions/event'
import TableListing from 'components/admin/table/TableListing'
import { updateActiveLink } from 'ducks/admin'
import ContentLoading from 'components/ContentLoading'

class EventList extends ReactQueryParams {
  componentDidMount() {
    this.props.dispatch(fetchEvents())
    this.props.dispatch(updateActiveLink('events'))
  }

  render() {
    const { eventState, error, dispatch } = this.props

    if (error) {
      return (
        <ContentLoading
          error={error}
          message='Quá trình tải dữ liệu xảy ra lỗi!'
        />
      )
    }

    return (
      <div className='content'>
        <div className='container-fluid animated fadeIn'>
          <div className='row'>
            <div className='col-md-12'>
              <TableListing
                itemState={eventState}
                tableHeader={tableHeader()}
                viewHeader='Danh sách sự kiện'
                arrLink={{ create: 'event-create', edit: 'event-edit', view: 'event-view', list: 'food-categories' }}
                deleteItem={deleteEvent}
                dispatch={dispatch}
                sortByKey={sortByKey}
                searchFunc={searchByKeyword}
                error={error}
                changePagination={changePagination}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  eventState: state.event
})

export default R.pipe(
  connect(mapStateToProps),
  isAdmin
)(EventList)
