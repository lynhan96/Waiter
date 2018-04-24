import React, {Component} from 'react'
import R from 'ramda'
import { connect } from 'react-redux'

import { isAdmin } from 'components/wrappers/isAdmin'
import { createUser, editFieldInfo, selectFieldData, customSelectFieldData } from 'lib/actions/user'
import TableCreateItem from 'components/admin/table/TableCreateItem'

class UserCreate extends Component {
  render() {
    const { dispatch } = this.props

    return (
      <div className='content'>
        <div className='container-fluid animated fadeIn'>
          <TableCreateItem
            editFieldInfo={editFieldInfo()}
            selectFieldData={selectFieldData()}
            customSelectFieldData={customSelectFieldData()}
            editHeader='Thêm Khách hàng'
            subHeader=''
            submitCreate={createUser}
            arrLink={{ list: 'users' }}
            dispatch={dispatch}
          />
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  loading: state.user.loading,
  error: state.user.error
})

export default R.pipe(
  connect(mapStateToProps),
  isAdmin
)(UserCreate)
