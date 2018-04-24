import React from 'react'
import R from 'ramda'
import ReactQueryParams from 'react-query-params'
import { connect } from 'react-redux'

import ContentLoading from 'components/ContentLoading'
import { isAdmin } from 'components/wrappers/isAdmin'
import { editFood, editFieldInfo, deleteFood, selectFieldData, customSelectFieldData } from 'lib/actions/food'
import { fetchFoodCategories } from 'lib/actions/foodCategory'
import TableEditItem from 'components/admin/table/TableEditItem'

class FoodEdit extends ReactQueryParams {
  componentDidMount() {
    this.props.dispatch(fetchFoodCategories())
  }

  render() {
    const { error, loading, foods, foodCategories, dispatch } = this.props
    const params = this.queryParams

    const categoryIds = R.pipe(
      R.map(R.prop(['id']))
    )(foodCategories)

    const categoryName = R.pipe(
      R.map(R.prop(['name']))
    )(foodCategories)

    const customSelectData = R.merge({foodCategoryId: {value: categoryIds, view: categoryName}})(customSelectFieldData())

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
            customSelectFieldData={customSelectData}
            editHeader='Chỉnh sửa thông tin Món ăn'
            arrLink={{ list: 'foods', view: 'food-view' }}
            itemIndex={params.index}
            subHeader={foods[params.index].name}
            submitEdit={editFood}
            items={foods}
            dispatch={dispatch}
            deleteItem={deleteFood}
          />
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  foods: state.food.items,
  foodCategories: state.foodCategory.items,
  loading: state.food.loading,
  error: state.food.error
})

export default R.pipe(
  connect(mapStateToProps),
  isAdmin
)(FoodEdit)
