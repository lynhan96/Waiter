import React, { Component } from 'react'
import { Modal } from 'react-bootstrap'
import { reduxForm } from 'redux-form'
import RemoveFoodForm from 'components/form/RemoveFoodForm'
import { sendRemoveFood } from 'lib/actions/ordering'
import { connect } from 'react-redux'
import { changeOrderModal } from 'ducks/modal'

class CancelFoodModal extends Component {
  constructor(props, context) {
    super(props, context)

    this.handleShow = this.handleShow.bind(this)
    this.handleClose = this.handleClose.bind(this)
  }

  handleClose() {
    this.props.dispatch(changeOrderModal(false, false))
  }

  handleShow() {
    this.props.dispatch(changeOrderModal(false, true))
  }

  render() {
    const { foodIndex, orderingId, currentQuantity } = this.props

    return (
      <div>
        <Modal
          show={this.props.cancelModal}
          onHide={this.handleClose}
        >
          <Modal.Body>
            <h2 style={{textAlign: 'center', margin: '0'}}>Hủy món</h2>
            <DecoratedRemoveFoodForm
              foodIndex={foodIndex}
              orderingId={orderingId}
              currentQuantity={currentQuantity}
            />
          </Modal.Body>
          <Modal.Footer>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}

const DecoratedRemoveFoodForm = reduxForm({
  form: 'removeFood',
  onSubmit: sendRemoveFood
})(RemoveFoodForm)

const mapStateToProps = state => ({
  cancelModal: state.modal.cancelModal
})

export default connect(mapStateToProps)(CancelFoodModal)
