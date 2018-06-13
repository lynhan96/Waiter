import React, {Component} from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import R from 'ramda'
import {Tabs, Tab} from 'material-ui/Tabs'

import { isAdmin } from 'components/wrappers/isAdmin'
import { fetchFoodCategories } from 'lib/actions/foodCategory'
import { fetchFoods } from 'lib/actions/food'
import { updateSelectedFood } from 'ducks/selectedFood'
import { submitOrder } from 'lib/actions/submit'
import { priceToString, searchSearch } from 'lib/objects'

class Foods extends Component {
  constructor (props) {
    super(props)

    this.increaseFood = this.increaseFood.bind(this)
    this.decreaseFood = this.decreaseFood.bind(this)
    this.orderFood = this.orderFood.bind(this)
    this.search = this.search.bind(this)

    this.state = {
      searchValue: ''
    }
  }

  componentDidMount() {
    this.props.dispatch(fetchFoods())
    this.props.dispatch(fetchFoodCategories())
    this.props.dispatch(updateSelectedFood({}))
  }

  search(e) {
    this.setState({ searchValue: e.target.value })
  }

  orderFood(values, dispatch) {
    submitOrder(values, dispatch)
  }

  increaseFood(foodId, dispatch) {
    let { selectedFood } = this.props
    let quantity = 1
    let newItem = {}

    if (!selectedFood) selectedFood = {}

    if (selectedFood[foodId]) {
      quantity = selectedFood[foodId].quantity + 1
    }

    newItem[foodId] = { quantity: quantity, id: foodId }

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

    if (quantity === 0) {
      newItem = R.dissoc(foodId, selectedFood)
    } else {
      newItem[foodId] = { quantity: quantity, id: foodId }
      newItem = R.merge(selectedFood)(newItem)
    }

    this.props.dispatch(updateSelectedFood(newItem))
  }

  render() {
    const { categories, foods, selectedFood, dispatch, type, tableId } = this.props

    const values = { type: type, tableId: tableId }

    if (this.state.searchValue !== '') {
      const searchFoods = searchSearch(this.state.searchValue, foods)

      return (
        <div className='content'>
          <div className='container-fluid animated fadeIn'>
            <div className="form-group" style={style.search}>
                <input type="text" className="form-control" placeholder="Tìm kiếm món ăn" onChange={e => { e.preventDefault(); this.search(e) }}/>
            </div>
            <div className='row'>
              <div style={{ width: '100%', textAlign: 'center', float: 'left', marginTop: '20px' }}>
                <Link
                  to='#'
                  style={style.orderFood}
                  onClick={e => { e.preventDefault(); this.orderFood(values, dispatch) }}
                > Gọi món</Link>
              </div>
              <div className='card' style={{ height: '80vh', overflowY: 'scroll' }}>
                <div className='card-content'style={{ width: '100%', float: 'left', padding: '40px 20px' }}>
                  {searchFoods.map((item, index) => {
                    const image = R.values(item.imageUrl)

                    return (
                      <div className='col-md-4 col-sm-4 food-item' key={index}>
                        <article className='menus-container wow fadeIn animated' data-wow-delay='0.1s'>
                          <div>
                            <img src={ image.length > 0 ? image[0] : '' } style={{ objectFit: 'contain', width: '100%', height: '200px' }}/>
                          </div>
                          <h4 className='item-title' style={style.name}>{item.name}</h4>
                          <div className='item-entry'>
                            <p style={style.description}> {priceToString(item.currentPrice)}</p>
                          </div>
                          {
                            item.status === 'Hết món' ?
                            <p style={style.message}>(*) Hiện tại nhà hàng đã hết món ăn này</p> :
                            <div className='text-center number-order'>
                              <Link className='fa fa-2x fa-minus-circle' style={style.selectButton} onClick={e => { e.preventDefault(); this.decreaseFood(item.id, dispatch) }}/>
                              <span style={style.quantity}>{selectedFood && selectedFood[item.id.toString()] ? selectedFood[item.id.toString()].quantity : 0 }</span>
                              <Link className='fa fa-2x fa-plus-circle' style={style.selectButton} onClick={e => { e.preventDefault(); this.increaseFood(item.id, dispatch) }}/>
                            </div>
                          }
                        </article>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className='content'>
        <div className='container-fluid animated fadeIn'>
          <div className="form-group" style={style.search}>
              <input type="text" className="form-control" placeholder="Tìm kiếm món ăn" onChange={e => { e.preventDefault(); this.search(e) }}/>
          </div>
          <Tabs onChange={this.selectType}>
            {categories.map((category, categoryIndex) => {
              return (
                <Tab label={category.name} style={style.tabHeader} key={categoryIndex}>
                  <div className='row'>
                    <div style={{ width: '100%', textAlign: 'center', float: 'left', marginTop: '20px' }}>
                      <Link
                        to='#'
                        style={style.orderFood}
                        onClick={e => { e.preventDefault(); this.orderFood(values, dispatch) }}
                      > Gọi món</Link>
                    </div>
                    <div className='card' style={{ height: '80vh', overflowY: 'scroll' }}>
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
                                    <p style={style.description}> {priceToString(item.currentPrice)}</p>
                                  </div>
                                  {
                                    item.status === 'Hết món' ?
                                    <p style={style.message}>(*) Hiện tại nhà hàng đã hết món ăn này</p> :
                                    <div className='text-center number-order'>
                                      <Link className='fa fa-2x fa-minus-circle' style={style.selectButton} onClick={e => { e.preventDefault(); this.decreaseFood(item.id, dispatch) }}/>
                                      <span style={style.quantity}>{selectedFood && selectedFood[item.id.toString()] ? selectedFood[item.id.toString()].quantity : 0 }</span>
                                      <Link className='fa fa-2x fa-plus-circle' style={style.selectButton} onClick={e => { e.preventDefault(); this.increaseFood(item.id, dispatch) }}/>
                                    </div>
                                  }
                                </article>
                              </div>
                            )
                          }
                        })}
                      </div>
                    </div>
                  </div>
                </Tab>
              )
            })}
          </Tabs>
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
  search: {
    width: '100%',
    marginTop: '4px'
  },
  message: {
    fontSize: '17px',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  name: {
    textAlign: 'center',
    fontWeight: 'bold'
  },
  quantity: {
    userSelect: 'none'
  },
  header: {
    textAlign: 'center',
    fontSize: '25px'
  },
  description: {
    textAlign: 'center',
    fontSize: '20px'
  },
  selectButton: {
    cursor: 'pointer'
  },
  tabHeader: {
    textTransform: 'capitalize',
    fontWeight: 'bold',
    fontSize: '17px'
  },
  orderFood: {
    textAlign: 'center',
    fontSize: '17px',
    backgroundColor: 'green',
    color: 'white',
    padding: '8px 30px',
    borderRadius: '20px',
    margin: '8px 0',
    fontWeight: 'bold'
  }
}
