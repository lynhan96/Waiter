import React, {Component} from 'react'
import { Field } from 'redux-form'
import { connect } from 'react-redux'
import R from 'ramda'

import SubmitButton from 'components/form/element/SubmitButton'
import CustomSelectField from 'components/form/element/CustomSelectField'

class OrderForm extends Component {
  render() {
    const { submitting, handleSubmit, tables } = this.props

    const tableIds = R.pipe(
      R.keys
    )(tables)

    const tableNames = R.pipe(
      R.values,
      R.map(R.prop('name'))
    )(tables)

    const typeSelectData = { type: {value: ['addOrder', 'newOrder'], view: ['Thêm món ăn', 'Tạo mới ']} }
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
  tables: state.table.items
})

export default connect(mapStateToProps)(OrderForm)
