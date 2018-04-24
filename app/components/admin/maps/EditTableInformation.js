import React from 'react'
import R from 'ramda'
import ReactQueryParams from 'react-query-params'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { reduxForm } from 'redux-form'

import UpdateTableForm from 'components/form/UpdateTableForm'
import { submitUpdateTable } from 'lib/actions/table'
import ContentLoading from 'components/ContentLoading'
import { isAdmin } from 'components/wrappers/isAdmin'

class EditTableInformation extends ReactQueryParams {
  componentDidMount() {
  }

  render() {
    const { loading, tables } = this.props
    const params = this.queryParams

    if (loading) {
      return (
        <ContentLoading
          message='Đang Cập nhập dữ liệu ...'
        />
      )
    }

    return (
      <div className='content'>
        <div className='container-fluid animated fadeIn'>
          <div className='row'>
            <div className='col-md-2'></div>
            <div className='col-md-8'>
                <div className='card'>
                  <div className='card-header' data-background-color='purple'>
                    <h4 className='title'>Chỉnh sửa thông tin bàn ăn</h4>
                  </div>
                  <div className='card-content'>
                    <div>
                      <Link to='map-tables' className='btn btn-success btn-round' style={style.buttonMargin}>
                        Trở lại
                      </Link>
                    </div>
                    <DecoratedUpdateTableForm
                      item={tables[params.id]}
                      id={params.id}
                    />
                  </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const DecoratedUpdateTableForm = reduxForm({
  form: 'editTable',
  onSubmit: submitUpdateTable
})(UpdateTableForm)

const mapStateToProps = state => ({
  tables: state.table.items,
  loading: state.table.loading,
  error: state.table.error
})

const style = {
  cardBackground: {
    background: 'white',
    marginTop: '20vh'
  },
  cardHeaderBackground: {
    background: '#ff9800'
  },
  cardTitle: {
    textAlign: 'center',
    color: 'white',
    fontWeight: '600'
  }
}

export default R.pipe(
  connect(mapStateToProps),
  isAdmin
)(EditTableInformation)
