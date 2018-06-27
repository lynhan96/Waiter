import React, { Component } from 'react'
import { Modal } from 'react-bootstrap'
import { connect } from 'react-redux'
import { changeOrderModal } from 'ducks/modal'
import Foods from 'pages/Foods'

class ShowMenu extends Component {
  constructor(props, context) {
    super(props, context)

    this.handleShow = this.handleShow.bind(this)
    this.handleClose = this.handleClose.bind(this)
  }

  handleClose() {
    this.props.dispatch(changeOrderModal(false, false))
  }

  handleShow() {
    this.props.dispatch(changeOrderModal(true, true))
  }

  render() {
    return (
      <div>
        { this.props.orderModal ? '' :
          <div className='button-order hvr-grow' onClick={this.handleShow}>
            {this.props.type === 'newOrder' ? 'Chọn món' : 'Thêm món'}
          </div>
        }
        <Modal
          id='menu'
          show={this.props.orderModal}
          onHide={this.handleClose}
          bsSize='large'
          aria-labelledby='contained-modal-title-lg'
        >
          <Modal.Body>
            <Foods
              tableId={this.props.tableId}
              type={this.props.type}
            />
          </Modal.Body>
          <Modal.Footer>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  orderModal: state.modal.orderModal
})

export default connect(mapStateToProps)(ShowMenu)
