import React from 'react'
import R from 'ramda'
import ReactQueryParams from 'react-query-params'
import { connect } from 'react-redux'

import ContentLoading from 'components/ContentLoading'
import { isAdmin } from 'components/wrappers/isAdmin'
import { editUser, editFieldInfo, deleteUser, selectFieldData, customSelectFieldData } from 'lib/actions/user'
import TableEditItem from 'components/admin/table/TableEditItem'

class UserEdit extends ReactQueryParams {
  render() {
    const { error, users, dispatch } = this.props
    const params = this.queryParams

    if (error) {
      return (
        <ContentLoading
          message='Quá trình tải dữ liệu xảy ra lỗi!'
        />
      )
    }

    return (
      <div className='content'>
        <div className='container-fluid animated fadeIn'>
          <TableEditItem
            editFieldInfo={editFieldInfo()}
            selectFieldData={selectFieldData()}
            customSelectFieldData={customSelectFieldData()}
            editHeader='Chỉnh sửa thông tin Khách hàng'
            arrLink={{ list: 'users', view: 'user-view' }}
            itemIndex={params.index}
            subHeader={users[params.index].name}
            submitEdit={editUser}
            items={users}
            dispatch={dispatch}
            deleteItem={deleteUser}
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
)(UserEdit)
