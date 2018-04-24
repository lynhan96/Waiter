import React from 'react'
import R from 'ramda'
import ReactQueryParams from 'react-query-params'
import { connect } from 'react-redux'

import { isAdmin } from 'components/wrappers/isAdmin'
import { tableHeader, fetchEmployees, deleteEmployee, sortByKey, searchByKeyword, changePagination } from '../../../lib/actions/employee'
import TableListing from 'components/admin/table/TableListing'
import { updateActiveLink } from 'ducks/admin'
import ContentLoading from 'components/ContentLoading'

class EmployeeList extends ReactQueryParams {
  componentDidMount() {
    this.props.dispatch(fetchEmployees())
    this.props.dispatch(updateActiveLink('employees'))
  }

  render() {
    const { employeeState, error, dispatch } = this.props

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
                itemState={employeeState}
                tableHeader={tableHeader()}
                viewHeader='Danh sách Nhân viên'
                arrLink={{ create: 'employee-create', edit: 'employee-edit', view: 'employee-view', list: 'employees' }}
                deleteItem={deleteEmployee}
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
  employeeState: state.employee
})

export default R.pipe(
  connect(mapStateToProps),
  isAdmin
)(EmployeeList)
