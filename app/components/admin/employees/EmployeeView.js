import React from 'react'
import R from 'ramda'
import ReactQueryParams from 'react-query-params'
import { connect } from 'react-redux'

import ErrorMessage from 'components/ErrorMessage'
import ContentLoading from 'components/ContentLoading'
import { isAdmin } from 'components/wrappers/isAdmin'
import { viewLabelHeader, deleteEmployee } from '../../../lib/actions/employee'
import TableViewItem from 'components/admin/table/TableViewItem'

class EmployeeList extends ReactQueryParams {
  render() {
    const { error, loading, employees, dispatch } = this.props
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
            viewHeader='Thông tin Nhân viên'
            arrLink={{ list: 'employees', edit: 'employee-edit' }}
            data={employees[params.index]}
            subHeader={employees[params.index].name}
            deleteItem={deleteEmployee}
            itemIndex={params.index}
            items={employees}
            dispatch={dispatch}
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
)(EmployeeList)
