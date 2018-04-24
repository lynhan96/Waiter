import React from 'react'
import R from 'ramda'
import ReactQueryParams from 'react-query-params'
import { connect } from 'react-redux'

import ErrorMessage from 'components/ErrorMessage'
import ContentLoading from 'components/ContentLoading'
import { isAdmin } from 'components/wrappers/isAdmin'
import { viewLabelHeader, deleteFoodCategory } from '../../../lib/actions/foodCategory'
import TableViewItem from 'components/admin/table/TableViewItem'

class FoodCategoryView extends ReactQueryParams {
  render() {
    const { error, loading, foodCategories, dispatch } = this.props
    const params = this.queryParams

    if (error) {
      return (
        <ContentLoading
          message='Quá trình tải dữ liệu xảy ra lỗi!'
        />
      )
    }

    if (loading) {
      return (
        <ContentLoading
          message='Đang tải dữ liệu ...'
        />
      )
    }

    return (
      <div className='content'>
        <div className='container-fluid animated fadeIn'>
          {error && <ErrorMessage text={error} />}
          <TableViewItem
            viewLabelHeader={viewLabelHeader()}
            viewHeader='Thông tin Danh mục'
            arrLink={{ list: 'food-categories', edit: 'food-category-edit' }}
            data={foodCategories[params.index]}
            subHeader={foodCategories[params.index].name}
            deleteItem={deleteFoodCategory}
            itemIndex={params.index}
            items={foodCategories}
            dispatch={dispatch}
          />
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  foodCategories: state.foodCategory.items,
  loading: state.foodCategory.loading,
  error: state.foodCategory.error
})

export default R.pipe(
  connect(mapStateToProps),
  isAdmin
)(FoodCategoryView)
