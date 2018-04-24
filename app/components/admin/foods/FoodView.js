import React from 'react'
import R from 'ramda'
import ReactQueryParams from 'react-query-params'
import { connect } from 'react-redux'

import ErrorMessage from 'components/ErrorMessage'
import ContentLoading from 'components/ContentLoading'
import { isAdmin } from 'components/wrappers/isAdmin'
import { viewLabelHeader, deleteFood } from 'lib/actions/food'
import TableViewItem from 'components/admin/table/TableViewItem'

class FoodView extends ReactQueryParams {
  render() {
    const { error, loading, foods, dispatch } = this.props
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
            viewHeader='Thông tin Món ăn'
            arrLink={{ list: 'foods', edit: 'food-edit' }}
            data={foods[params.index]}
            subHeader={foods[params.index].name}
            deleteItem={deleteFood}
            itemIndex={params.index}
            items={foods}
            dispatch={dispatch}
          />
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  foods: state.food.items,
  loading: state.food.loading,
  error: state.food.error
})

export default R.pipe(
  connect(mapStateToProps),
  isAdmin
)(FoodView)
