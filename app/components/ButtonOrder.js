import React, { Component } from 'react'
import { Modal } from 'react-bootstrap'
import { reduxForm } from 'redux-form'
import OrderForm from 'components/form/OrderForm'
import { submitOrder } from 'lib/actions/submit'

class ButtonOrder extends Component {
  constructor(props, context) {
    super(props, context)

    this.handleShow = this.handleShow.bind(this)
    this.handleClose = this.handleClose.bind(this)

    this.state = {
      show: false
    }
  }

  handleClose() {
    this.setState({ show: false })
  }

  handleShow() {
    this.setState({ show: true })
  }

  render() {
    return (
      <div>
        <div className='button-order hvr-grow' onClick={this.handleShow}>
          Đặt món
        </div>
        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Body>
            <h2 style={{textAlign: 'center'}}>Đặt món</h2>
            <DecoratedOrderForm />
          </Modal.Body>
          <Modal.Footer>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}

const DecoratedOrderForm = reduxForm({
  form: 'order',
  onSubmit: submitOrder
})(OrderForm)

export default ButtonOrder
