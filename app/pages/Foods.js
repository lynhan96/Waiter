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
      <div className='row' style={{margin: '0'}}>
        <div id='main-container' className='main-container pull-right' >
          <section id='our-menus'>
            <div className='our-menu section-padding' style = {{paddingTop: '30px', paddingBottom: '30px'}}>
              <div className='section-title-container'>
                <h2 className='section-title'>{category ? category.name : ''}</h2>
              </div>
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
                          <span>{selectedFood && selectedFood[item.id.toString()] ? selectedFood[item.id.toString()].quantity : 0 }</span>
                          <Link className='fa fa-2x fa-plus-circle' style={style.selectButton} onClick={e => { e.preventDefault(); this.increaseFood(item.id, dispatch) }}/>
                        </div>
                      </article>
                    </div>
                  )
                }
              })}
            </div>
          </section>
        </div>

        <div id='scroll-to-top' className='right-fix-btn'>
          <div className='go-to-top'>
            <i className='fa fa-angle-double-up'></i>
          </div>
        </div>

        <footer id='footer-section' className='main-container pull-right'>
          <div className='copyrights '>
            &copy; <a href='#'>Foody</a>  2015 - All Rights Reserved <span className='v-line'></span> Developed by <a href='http://jeweltheme.com'>Jewel Theme</a>
          </div>
        </footer>
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
  description: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  selectButton: {
    cursor: 'pointer'
  }
}