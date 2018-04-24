import React, {Component} from 'react'
import { Field } from 'redux-form'

import InputText from 'components/form/element/InputText'
import SubmitButton from 'components/form/element/SubmitButton'
import ImageUploader from 'components/form/element/ImageUploader'

// This form is pure so it is easy to test
// Page/Login will decorate it with the necessary props
class AddZoneForm extends Component {
  render() {
    const { submitting, handleSubmit } = this.props

    return (
      <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
        <Field
          name='name'
          component={InputText}
          label='Tên'
          type='text'
          required={true}
        />
        <Field
          name='imageUrl'
          component={ImageUploader}
          label='Hình ảnh sơ đồ nhà hàng'
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

export default AddZoneForm
