import React from 'react'
import R from 'ramda'
import ReactQueryParams from 'react-query-params'
import { connect } from 'react-redux'

import ContentLoading from 'components/ContentLoading'
import { isAdmin } from 'components/wrappers/isAdmin'
import { editFieldInfo, deleteFoodCategory, selectFieldData, customSelectFieldData } from '../../../lib/actions/foodCategory'
import TableEditItem from 'components/admin/table/TableEditItem'
import { editFoodCategory } from 'lib/actions/foodCategory'

class FoodCategoryEdit extends ReactQueryParams {
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
          message='Đang Cập nhập dữ liệu ...'
        />
      )
    }

    return (
      <div className='content'>
        <div className='container-fluid animated fadeIn'>
          <TableEditItem
            editFieldInfo={editFieldInfo()}
            selectFieldData={selectFieldData()}
            customSelectFieldData={customSelectFieldData()}
            editHeader='Chỉnh sửa thông tin Danh mục'
            arrLink={{ list: 'food-categories', view: 'food-category-view' }}
            itemIndex={params.index}
            subHeader={foodCategories[params.index].name}
            submitEdit={editFoodCategory}
            items={foodCategories}
            dispatch={dispatch}
            deleteItem={deleteFoodCategory}
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
)(FoodCategoryEdit)
