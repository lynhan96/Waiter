import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { priceToString } from 'lib/objects'

// We receive props from ReduxForm's Field
// and turn them into props for Bootstrap forms
class ViewOrderPrice extends Component {
  render() {
    const { orderings, orderingId } = this.props

    return (
      <Link className='button-view-order hvr-grow' to='food-orders'>
        <span><i className="material-icons">shopping_cart</i> {orderings[orderingId].items.length}</span>
        <p style={styles.totalPrice}>{priceToString(orderings[orderingId].totalPrice)}</p>
      </Link>
    )
  }
}

const mapStateToProps = state => ({
  orderings: state.ordering.items
})

export default connect(mapStateToProps)(ViewOrderPrice)

const styles = {
  totalPrice: {
    fontSize: '20px',
    margin: '10px 20px 0 20px'
  }
}
