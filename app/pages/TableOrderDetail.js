import React from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import R from 'ramda'
import ReactQueryParams from 'react-query-params'
import { isAdmin } from 'components/wrappers/isAdmin'

import { priceToString } from 'lib/objects'

class TableOrderDetail extends ReactQueryParams {
  render() {
    const { orderings, tables } = this.props
    let params = this.queryParams
    const currentTable = tables[params.tableId]

    if (!currentTable.lastOrderingId) {
      return (
        <div className='content'>
          <div className='container-fluid animated fadeIn'>
            <div className='row'>
              <div className='card'>
                <div className='card-header' data-background-color='purple'>
                  <h3 className='title' style={style.header}>Không tìm thấy Order của bàn này</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    const ordering = orderings[currentTable.lastOrderingId]

    return (
      <div className='content'>
        <div className='container-fluid animated fadeIn'>
          <div className='row'>
            <div className='card'>
              <div className='card-header' data-background-color='purple'>
                <h3 className='title' style={style.header}>Giỏ Hàng</h3>
                <h4 className='title' style={style.header}>{'(' + priceToString(ordering.totalPrice) + ')'}</h4>
              </div>
              <div className='card-content'style={{ width: '100%', float: 'left', padding: '40px 20px' }}>
                {ordering.items.map((item, index) => {
                  const image = R.values(item.imageUrl)

                  return (
                    <div className='col-md-4 col-sm-4 food-item' key={index}>
                      <article className='menus-container wow fadeIn animated' data-wow-delay='0.1s'>
                        <div className='item-entry'>
                          <p style={style.status}> {item.status}</p>
                        </div>
                        <div>
                          <img src={ image.length > 0 ? image[0] : '' } style={{ objectFit: 'contain', width: '100%', height: '200px' }}/>
                        </div>
                        <h4 className='item-title' style={style.name}>{item.name}</h4>
                        <div className='item-entry'>
                          <p style={style.description}> {priceToString(item.currentPrice) + ' x ' + item.quantity}</p>
                        </div>
                        <div className='item-entry' style={{width: '100%', margin: '20px 0', textAlign: 'center'}}>
                          <Link to='#' style={style.deleteFood}> Hủy món</Link>
                        </div>
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
}

const mapStateToProps = state => ({
  orderings: state.ordering.items,
  tables: state.table.items
})

export default R.pipe(
  isAdmin,
  connect(mapStateToProps)
)(TableOrderDetail)

const style = {
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
  status: {
    textAlign: 'center',
    fontSize: '20px',
    backgroundColor: 'green',
    color: 'white',
    padding: '8px 20px',
    borderRadius: '20px',
    margin: '8px 0'
  },
  deleteFood: {
    textAlign: 'center',
    fontSize: '17px',
    backgroundColor: 'red',
    color: 'white',
    padding: '8px 15px',
    borderRadius: '20px',
    margin: '8px 0',
    fontWeight: 'bold'
  }
}
