import React from 'react'
import R from 'ramda'
import ReactQueryParams from 'react-query-params'
import { connect } from 'react-redux'

import { isAdmin } from 'components/wrappers/isAdmin'
import { tableHeader, fetchFoods, deleteFood, sortByKey, searchByKeyword, changePagination } from 'lib/actions/food'
import TableListing from 'components/admin/table/TableListing'
import { updateActiveLink } from 'ducks/admin'
import ContentLoading from 'components/ContentLoading'

class FoodList extends ReactQueryParams {
  componentDidMount() {
    this.props.dispatch(fetchFoods())
    this.props.dispatch(updateActiveLink('foods'))
  }

  render() {
    const { foodState, error, dispatch } = this.props

    if (error) {
      return (
        <ContentLoading
          error={error}
          message='Quá trình tải dữ liệu xảy ra lỗi!'
        />
      )
    }

    return (
      <div className='content'>
        <div className='container-fluid animated fadeIn'>
          <div className='row'>
            <div className='col-md-12'>
              <TableListing
                itemState={foodState}
                tableHeader={tableHeader()}
                viewHeader='Danh sách Danh mục thức ăn'
                arrLink={{ create: 'food-create', edit: 'food-edit', view: 'food-view', list: 'foods' }}
                deleteItem={deleteFood}
                dispatch={dispatch}
                sortByKey={sortByKey}
                searchFunc={searchByKeyword}
                error={error}
                changePagination={changePagination}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  foodState: state.food
})

export default R.pipe(
  connect(mapStateToProps),
  isAdmin
)(FoodList)
