import React, {Component} from 'react'
import R from 'ramda'
import { connect } from 'react-redux'

import ContentLoading from 'components/ContentLoading'
import { isAdmin } from 'components/wrappers/isAdmin'
import { editFieldInfo, selectFieldData, customSelectFieldData } from '../../../lib/actions/foodCategory'
import { createFoodCategory } from 'lib/actions/foodCategory'
import TableCreateItem from 'components/admin/table/TableCreateItem'

class FoodCategoryCreate extends Component {
  render() {
    const { loading, dispatch } = this.props

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
          <TableCreateItem
            editFieldInfo={editFieldInfo()}
            selectFieldData={selectFieldData()}
            customSelectFieldData={customSelectFieldData()}
            editHeader='Thêm Danh Mục Thức Ăn'
            subHeader=''
            submitCreate={createFoodCategory}
            arrLink={{ list: 'food-categories' }}
            dispatch={dispatch}
          />
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  loading: state.foodCategory.loading,
  error: state.foodCategory.error
})

export default R.pipe(
  connect(mapStateToProps),
  isAdmin
)(FoodCategoryCreate)
