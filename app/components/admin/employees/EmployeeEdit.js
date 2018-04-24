import React from 'react'
import R from 'ramda'
import ReactQueryParams from 'react-query-params'
import { connect } from 'react-redux'

import ContentLoading from 'components/ContentLoading'
import { isAdmin } from 'components/wrappers/isAdmin'
import { editFieldInfo, deleteEmployee, selectFieldData } from '../../../lib/actions/employee'
import TableEditItem from 'components/admin/table/TableEditItem'
import { editEmployee } from 'lib/actions/employee'

class EmployeeEdit extends ReactQueryParams {
  render() {
    const { error, employees, dispatch } = this.props
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
            editHeader='Chỉnh sửa thông tin Nhân viên'
            arrLink={{ list: 'employees', view: 'employee-view' }}
            itemIndex={params.index}
            subHeader={employees[params.index].name}
            submitEdit={editEmployee}
            items={employees}
            dispatch={dispatch}
            deleteItem={deleteEmployee}
          />
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  employees: state.employee.items,
  loading: state.employee.loading,
  error: state.employee.error
})

export default R.pipe(
  connect(mapStateToProps),
  isAdmin
)(EmployeeEdit)
