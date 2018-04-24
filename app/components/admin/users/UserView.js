import React from 'react'
import R from 'ramda'
import ReactQueryParams from 'react-query-params'
import { connect } from 'react-redux'

import ErrorMessage from 'components/ErrorMessage'
import ContentLoading from 'components/ContentLoading'
import { isAdmin } from 'components/wrappers/isAdmin'
import { viewLabelHeader, deleteUser } from 'lib/actions/user'
import TableViewItem from 'components/admin/table/TableViewItem'

class UserView extends ReactQueryParams {
  render() {
    const { error, loading, users, dispatch } = this.props
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
            viewHeader='Thông tin Món ăn'
            arrLink={{ list: 'users', edit: 'user-edit' }}
            data={users[params.index]}
            subHeader={users[params.index].name}
            deleteItem={deleteUser}
            itemIndex={params.index}
            items={users}
            dispatch={dispatch}
          />
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  users: state.user.items,
  loading: state.user.loading,
  error: state.user.error
})

export default R.pipe(
  connect(mapStateToProps),
  isAdmin
)(UserView)
