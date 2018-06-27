import React, {Component} from 'react'
import {Field} from 'redux-form'

import InputText from 'components/form/element/InputText'
import SubmitButton from 'components/form/element/SubmitButton'

class RemoveFoodForm extends Component {
  render() {
    const { foodIndex, orderingId, currentQuantity, submitting, handleSubmit } = this.props

    return (
      <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
        <Field
          name='quantity'
          component={InputText}
          type='number'
          max= {currentQuantity}
          defaultValue=''
          label='Số lượng'
          required={true}
        />
        <Field
          name='foodIndex'
          component={InputText}
          type='hidden'
          defaultValue={foodIndex}
        />
        <Field
          name='orderingId'
          component={InputText}
          type='hidden'
          defaultValue={orderingId}
        />
        <div className='col-md-12' style={{ textAlign: 'center' }}>
          <SubmitButton
            text='Gửi yêu cầu'
            submitting={submitting}
            className='btn btn-primary'
          />
        </div>
      </form>
    )
  }
}

export default RemoveFoodForm
