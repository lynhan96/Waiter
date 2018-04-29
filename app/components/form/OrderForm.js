import React, {Component} from 'react'
import { Field } from 'redux-form'
import { connect } from 'react-redux'
import R from 'ramda'
import {Tabs, Tab} from 'material-ui/Tabs'

import SubmitButton from 'components/form/element/SubmitButton'

class OrderForm extends Component {
  render() {
    const { submitting, handleSubmit, tables, zones } = this.props
    const tableIds = R.keys(tables)
    return (
      <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
        <Tabs>
          <Tab label='Tạo mới order'>
            <div style={styles.wrapper}>
              {tableIds.map((key, index) => {
                const item = tables[key]

                if (item.status === 'Còn trống') {
                  return (
                    <div style={styles.tableWrapper} key={index}>
                      <div style={styles.tableName}>{item.name}</div>
                      <div>{'(' + zones[item.zoneId].name + ')'}</div>
                    </div>
                  )
                }
              })}
            </div>
          </Tab>
          <Tab label='Thêm món ăn cho bàn đã order'>
            <div style={styles.wrapper}>
              {tableIds.map((key, index) => {
                const item = tables[key]
                if (item.status === 'Đã có khách' || item.status === 'Đã đặt bàn') {
                  return (
                    <div style={styles.tableWrapper} key={index}>
                      <div style={styles.tableName}>{item.name}</div>
                      <div>{'(' + zones[item.zoneId].name + ')'}</div>
                    </div>
                  )
                }
              })}
            </div>
          </Tab>
        </Tabs>

        <div className='col-md-12' style={{ textAlign: 'center' }}>
          <SubmitButton
            text='Xác nhận'
            submitting={submitting}
            className='btn btn-primary'
          />
        </div>
      </form>
    )
  }
}

const mapStateToProps = (state) => ({
  tables: state.table.items,
  zones: state.zone.items
})

export default connect(mapStateToProps)(OrderForm)

const styles = {
  wrapper: {
    marginTop: '20px'
  },
  tableWrapper: {
    padding: '20px',
    width: '20%',
    border: '2px dashed #ffd984',
    display: 'inline-block',
    textAlign: 'center'
  },
  tableName: {
    fontSize: '17px',
    fontWeight: 'bold'
  }
}
