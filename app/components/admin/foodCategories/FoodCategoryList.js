import React from 'react'
import R from 'ramda'
import ReactQueryParams from 'react-query-params'
import { connect } from 'react-redux'

import { isAdmin } from 'components/wrappers/isAdmin'
import { tableHeader, fetchFoodCategories, deleteFoodCategory, sortByKey, searchByKeyword, changePagination } from 'lib/actions/foodCategory'
import TableListing from 'components/admin/table/TableListing'
import { updateActiveLink } from 'ducks/admin'
import ContentLoading from 'components/ContentLoading'

class FoodCategoryList extends ReactQueryParams {
  componentDidMount() {
    this.props.dispatch(fetchFoodCategories())
    this.props.dispatch(updateActiveLink('food-categories'))
  }

  render() {
    const { foodCategoryState, error, dispatch } = this.props

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
                itemState={foodCategoryState}
                tableHeader={tableHeader()}
                viewHeader='Danh sách Danh mục thức ăn'
                arrLink={{ create: 'food-category-create', edit: 'food-category-edit', view: 'food-category-view', list: 'food-categories' }}
                deleteItem={deleteFoodCategory}
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
  foodCategoryState: state.foodCategory
})

export default R.pipe(
  connect(mapStateToProps),
  isAdmin
)(FoodCategoryList)
