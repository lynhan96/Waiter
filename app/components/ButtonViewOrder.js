import React, { Component } from 'react'
import { connect } from 'react-redux'
import R from 'ramda'
import { Link } from 'react-router'
import { makeTotalPrice, priceToString } from 'lib/objects'

// We receive props from ReduxForm's Field
// and turn them into props for Bootstrap forms
class ButtonViewOrder extends Component {
  render() {
    const { selectedFood, foods } = this.props
    const totalPrice = makeTotalPrice(selectedFood, foods)

    return (
      <Link className='button-view-order hvr-grow' to='food-orders'>
        <span><i className="material-icons">shopping_cart</i> {R.values(selectedFood).length}</span>
        <p style={styles.totalPrice}>{priceToString(totalPrice)}</p>
      </Link>
    )
  }
}

const mapStateToProps = state => ({
  selectedFood: state.selectedFood.items,
  foods: state.food.items
})

export default connect(mapStateToProps)(ButtonViewOrder)

const styles = {
  totalPrice: {
    fontSize: '20px',
    margin: '10px 20px 0 20px'
  }
}
