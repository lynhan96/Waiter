import React from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import R from 'ramda'
import ReactQueryParams from 'react-query-params'
import { isAdmin } from 'components/wrappers/isAdmin'

import { updateActiveLink } from 'ducks/admin'
import { fetchFoodCategories } from 'lib/actions/foodCategory'
import { fetchFoods } from 'lib/actions/food'
import { updateSelectedFood } from 'ducks/selectedFood'

class Foods extends ReactQueryParams {
  constructor (props) {
    super(props)

    this.increaseFood = this.increaseFood.bind(this)
    this.decreaseFood = this.decreaseFood.bind(this)
  }

  componentDidMount() {
    this.props.dispatch(fetchFoods())
    this.props.dispatch(fetchFoodCategories())
    this.props.dispatch(updateActiveLink('foods'))
  }

  increaseFood(foodId, dispatch) {
    let { selectedFood } = this.props
    let quantity = 1
    let newItem = {}

    if (!selectedFood) selectedFood = {}

    if (selectedFood[foodId]) {
      quantity = selectedFood[foodId].quantity + 1
    }

    newItem[foodId] = { quantity: quantity }

    newItem = R.merge(selectedFood)(newItem)

    this.props.dispatch(updateSelectedFood(newItem))
  }

  decreaseFood(foodId, dispatch) {
    let { selectedFood } = this.props
    let quantity = 0
    let newItem = {}

    if (!selectedFood) selectedFood = {}

    if (selectedFood[foodId] && selectedFood[foodId].quantity > 1) {
      quantity = selectedFood[foodId].quantity - 1
    }

    newItem[foodId] = { quantity: quantity }

    newItem = R.merge(selectedFood)(newItem)

    this.props.dispatch(updateSelectedFood(newItem))
  }

  render() {
    const { categories, foods, selectedFood, dispatch } = this.props
    const params = this.queryParams
    const category = categories[parseInt(params.index)]

    return (
      <div className='content'>
        <div className='container-fluid animated fadeIn'>
          <div className='row'>
            <div className='card'>
              <div className='card-header' data-background-color='purple'>
                <h4 className='title' style={style.header}>{category ? category.name : ''}</h4>
              </div>
              <div className='card-content'style={{ width: '100%', float: 'left', padding: '40px 20px' }}>
                {foods.map((item, index) => {
                  if (category && category.id === item.foodCategoryId) {
                    const image = R.values(item.imageUrl)

                    return (
                      <div className='col-md-4 col-sm-4 food-item' key={index}>
                        <article className='menus-container wow fadeIn animated' data-wow-delay='0.1s'>
                          <div>
                            <img src={ image.length > 0 ? image[0] : '' } style={{ objectFit: 'contain', width: '100%', height: '200px' }}/>
                          </div>
                          <h4 className='item-title' style={style.name}>{item.name}</h4>
                          <div className='item-entry'>
                            <p style={style.description}> {item.description}</p>
                          </div>
                          <div className='text-center number-order'>
                            <Link className='fa fa-2x fa-minus-circle' style={style.selectButton} onClick={e => { e.preventDefault(); this.decreaseFood(item.id, dispatch) }}/>
                            <span style={style.quantity}>{selectedFood && selectedFood[item.id.toString()] ? selectedFood[item.id.toString()].quantity : 0 }</span>
                            <Link className='fa fa-2x fa-plus-circle' style={style.selectButton} onClick={e => { e.preventDefault(); this.increaseFood(item.id, dispatch) }}/>
                          </div>
                        </article>
                      </div>
                    )
                  }
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  categories: state.foodCategory.items,
  foods: state.food.items,
  selectedFood: state.selectedFood.items
})

export default R.pipe(
  isAdmin,
  connect(mapStateToProps)
)(Foods)

const style = {
  name: {
    textAlign: 'center'
  },
  quantity: {
    userSelect: 'none'
  },
  header: {
    textAlign: 'center',
    fontSize: '25px'
  },
  description: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  selectButton: {
    cursor: 'pointer'
  }
}
