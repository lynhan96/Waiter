import React, {Component} from 'react'
import { Field } from 'redux-form'
import R from 'ramda'

import InputText from 'components/form/element/InputText'
import SubmitButton from 'components/form/element/SubmitButton'
import ImageUploader from 'components/form/element/ImageUploader'
import CustomSelectField from 'components/form/element/CustomSelectField'
import SelectField from 'components/form/element/SelectField'

// This form is pure so it is easy to test
// Page/Login will decorate it with the necessary props
class AddTableForm extends Component {
  render() {
    const { submitting, handleSubmit, zoneData } = this.props

    const zoneIds = R.pipe(
      R.keys
    )(zoneData)

    const zoneName = R.pipe(
      R.values,
      R.map(R.prop('name'))
    )(zoneData)

    const customSelectFieldData = { zoneId: {value: zoneIds, view: zoneName} }
    const selectFieldData = { status: ['Còn trống', 'Đã đặt', 'Đã có khách'] }

    return (
      <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
        <Field
          name='tableQuantity'
          component={InputText}
          label='Số Lượng Bàn Cần thêm'
          type='number'
          required={true}
        />
        <Field
          name='zoneId'
          component={CustomSelectField}
          label='Khu vực'
          required={true}
          customSelectFieldData={customSelectFieldData}
          fieldName='zoneId'
        />
        <Field
          name='status'
          component={SelectField}
          label='Trạng thái mặc định'
          required={true}
          selectFieldData={selectFieldData}
          fieldName='status'
        />
        <Field
          name='imageUrl'
          component={ImageUploader}
          label='Hình ảnh bàn ăn'
          required={true}
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

export default AddTableForm
