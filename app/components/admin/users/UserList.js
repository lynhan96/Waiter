import React from 'react'
import R from 'ramda'
import ReactQueryParams from 'react-query-params'
import { connect } from 'react-redux'

import { isAdmin } from 'components/wrappers/isAdmin'
import { tableHeader, fetchUsers, deleteUser, sortByKey, searchByKeyword, changePagination } from 'lib/actions/user'
import TableListing from 'components/admin/table/TableListing'
import { updateActiveLink } from 'ducks/admin'
import ContentLoading from 'components/ContentLoading'

class UserList extends ReactQueryParams {
  componentDidMount() {
    this.props.dispatch(fetchUsers())
    this.props.dispatch(updateActiveLink('users'))
  }

  render() {
    const { userState, error, dispatch } = this.props

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
                itemState={userState}
                tableHeader={tableHeader()}
                viewHeader='Danh sách Khách hàng'
                arrLink={{ create: 'user-create', edit: 'user-edit', view: 'user-view', list: 'users' }}
                deleteItem={deleteUser}
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
  userState: state.user
})

export default R.pipe(
  connect(mapStateToProps),
  isAdmin
)(UserList)
