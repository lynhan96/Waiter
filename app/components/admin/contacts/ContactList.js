import React from 'react'
import R from 'ramda'
import ReactQueryParams from 'react-query-params'
import { connect } from 'react-redux'

import { isAdmin } from 'components/wrappers/isAdmin'
import { tableHeader, fetchContact, seenContact, deleteContact, sortByKey, searchByKeyword, changePagination } from '../../../lib/actions/contact'
import TableListing from 'components/admin/table/TableListing'
import { updateActiveLink } from 'ducks/admin'
import ContentLoading from 'components/ContentLoading'

class ContactList extends ReactQueryParams {
  componentDidMount() {
    this.props.dispatch(fetchContact())
    this.props.dispatch(updateActiveLink('contacts'))
  }

  render() {
    const { contactState, error, dispatch } = this.props

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
                visableCreateButton={true}
                itemState={contactState}
                tableHeader={tableHeader()}
                viewHeader='Thông tin Liên hệ'
                arrLink={{ list: 'contacts' }}
                deleteItem={deleteContact}
                seenItem={seenContact}
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
  contactState: state.contact
})

export default R.pipe(
    connect(mapStateToProps),
    isAdmin
)(ContactList)
