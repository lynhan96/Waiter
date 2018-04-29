import React, {Component} from 'react'
import { Field } from 'redux-form'
import { connect } from 'react-redux'
import R from 'ramda'

import SubmitButton from 'components/form/element/SubmitButton'
import CustomSelectField from 'components/form/element/CustomSelectField'

class OrderForm extends Component {
  render() {
    const { orderForm, submitting, handleSubmit, tables } = this.props
    let tableIds = []
    let tableNames = []

    if (orderForm) {
      let formValues = orderForm.values

      if (formValues.type === 'newOrder') {
        tableIds = R.pipe(
          R.keys,
          R.filter(item => tables[item].status === 'Còn trống')
        )(tables)
      }

      if (formValues.type === 'addOrder') {
        tableIds = R.pipe(
          R.keys,
          R.filter(item => tables[item].status === 'Đã có khách' || tables[item].status === 'Đã đặt bàn')
        )(tables)
      }

      tableNames = R.pipe(
        R.map(item => tables[item].name)
      )(tableIds)
    }

    const typeSelectData = { type: {value: ['newOrder', 'addOrder'], view: ['Tạo mới', 'Thêm món ăn']} }
    const tableSelectData = { tableId: {value: tableIds, view: tableNames} }

    return (
      <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
        <Field
          name='type'
          component={CustomSelectField}
          label='Loại Order'
          required={true}
          customSelectFieldData={typeSelectData}
          fieldName='type'
        />
        <Field
          name='tableId'
          component={CustomSelectField}
          label='Bàn ăn'
          required={true}
          customSelectFieldData={tableSelectData}
          fieldName='tableId'
        />
        <div className='col-md-12' style={{ textAlign: 'center' }}>
          <SubmitButton
            text='Xác nhận'
            submitting={submitting}
            className='btn btn-primary'
          />
        </div>
      </form>
    )
  }
}

const mapStateToProps = (state) => ({
  tables: state.table.items,
  orderForm: state.form.order
})

export default connect(mapStateToProps)(OrderForm)
