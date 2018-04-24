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
      <Link className='button-view-order hvr-grow' to='food-orders'>
        <span><i className="material-icons">shopping_cart</i> {R.values(selectedFood).length}</span>
      </Link>
    )
  }
}

const mapStateToProps = state => ({
  selectedFood: state.selectedFood.items
})

export default connect(mapStateToProps)(ButtonViewOrder)
