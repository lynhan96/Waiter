import React, { Component } from 'react'
import { Modal } from 'react-bootstrap'
import { reduxForm } from 'redux-form'
import OrderForm from 'components/form/OrderForm'
import { submitOrder } from 'lib/actions/submit'
import { connect } from 'react-redux'
import { changeOrderModal } from 'ducks/modal'

class ButtonOrder extends Component {
  constructor(props, context) {
    super(props, context)

    this.handleShow = this.handleShow.bind(this)
    this.handleClose = this.handleClose.bind(this)
  }

  handleClose() {
    this.props.dispatch(changeOrderModal(false))
  }

  handleShow() {
    this.props.dispatch(changeOrderModal(true))
  }

  render() {
    return (
      <div>
        <div className='button-order hvr-grow' onClick={this.handleShow}>
          Đặt món
        </div>
        <Modal
          show={this.props.orderModal}
          onHide={this.handleClose}
          bsSize='large'
          aria-labelledby='contained-modal-title-lg'
        >
          <Modal.Body>
            <h2 style={{textAlign: 'center', margin: '0'}}>Đặt món</h2>
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

const mapStateToProps = state => ({
  orderModal: state.modal.orderModal
})

export default connect(mapStateToProps)(ButtonOrder)
