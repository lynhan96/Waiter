import React, { Component } from 'react'
import { connect } from 'react-redux'
import R from 'ramda'
import { Link } from 'react-router'

// We receive props from ReduxForm's Field
// and turn them into props for Bootstrap forms
class ButtonViewOrder extends Component {
  render() {
    const { selectedFood } = this.props

    return (
      <Link className='button-view-order' to='food-orders'>
        Giỏ hàng
        <div style={{color: 'red'}}>{R.values(selectedFood).length}</div>
      </Link>
    )
  }
}

const mapStateToProps = state => ({
  selectedFood: state.selectedFood.items
})

export default connect(mapStateToProps)(ButtonViewOrder)
