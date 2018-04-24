import React, {Component} from 'react'
import { Field } from 'redux-form'

import InputText from 'components/form/element/InputText'
import SubmitButton from 'components/form/element/SubmitButton'
import ImageUploader from 'components/form/element/ImageUploader'
import SelectField from 'components/form/element/SelectField'

// This form is pure so it is easy to test
// Page/Login will decorate it with the necessary props
class UpdateTableForm extends Component {
  render() {
    const { submitting, handleSubmit, item, id } = this.props

    const selectFieldData = { status: ['Còn trống', 'Đã đặt', 'Đã có khách'] }

    return (
      <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
        <Field
          style={{display: 'none'}}
          name='item'
          component={InputText}
          defaultValue={item}
          type='hidden'
        />
        <Field
          style={{display: 'none'}}
          name='id'
          component={InputText}
          defaultValue={id}
          type='hidden'
        />
        <Field
          name='tableName'
          component={InputText}
          label='Tên bàn ăn'
          defaultValue={item.name}
          type='text'
          required={true}
        />
        <Field
          name='status'
          component={SelectField}
          label='Trạng thái'
          required={true}
          defaultValue={item.status}
          selectFieldData={selectFieldData}
          fieldName='status'
        />
        <Field
          name='imageUrl'
          component={ImageUploader}
          label='Hình ảnh bàn ăn'
          defaultValue={item.imageUrl}
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

export default UpdateTableForm
