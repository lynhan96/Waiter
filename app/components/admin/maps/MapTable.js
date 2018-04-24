import React, { Component } from 'react'
import { connect } from 'react-redux'
import R from 'ramda'
import {Tabs, Tab} from 'material-ui/Tabs'
import RaisedButton from 'material-ui/RaisedButton'
import Navigator from 'lib/Navigator'
import 'styles/website.less'

import { isAdmin } from 'components/wrappers/isAdmin'
import { updateActiveLink } from 'ducks/admin'
import ContentLoading from 'components/ContentLoading'
import MapElement from 'components/admin/maps/MapElement'
import { fetchTables } from 'lib/actions/table'
import { fetchZones } from 'lib/actions/zone'

class MapTable extends Component {
  constructor (props) {
    super(props)

    this.addZoneOpen = this.addZoneOpen.bind(this)
    this.addTableOpen = this.addTableOpen.bind(this)
  }

  componentDidMount() {
    this.props.dispatch(fetchTables())
    this.props.dispatch(fetchZones())
    this.props.dispatch(updateActiveLink('map-tables'))
  }

  addZoneOpen() {
    Navigator.push('create-zone')
  }

  addTableOpen() {
    Navigator.push('create-table')
  }

  render() {
    const { error, zones, table, dispatch } = this.props

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
            <div className='card' style={{ padding: '10px' }}>
              <div style={{ padding: '20px' }}>
                <RaisedButton
                  label='Thêm khu vực'
                  primary={true}
                  style={{ margin: '10px' }}
                  onClick={this.addZoneOpen}
                />
                <RaisedButton
                  label='Tạo bàn ăn'
                  secondary={true}
                  onClick={this.addTableOpen}/>
              </div>
            </div>
          </div>
          <div className='row'>
            <Tabs>
              {R.values(zones).map((value, index) => {
                const imageUrl = R.values(value.imageUrl)[0]
                const zoneId = R.keys(zones)[index]
                let tables = null
                let tableKeys = null

                if (table != null) {
                  tables = R.filter(data => data.zoneId === zoneId)(R.values(table))
                  tableKeys = R.keys(table)
                }

                return (
                  <Tab label={value.name} key={index}>
                    <div className='card'>
                      <section style={{ padding: '5px', backgroundImage: 'url("' + imageUrl + '")', backgroundSize: 'cover' }}>
                        <div className='container-fluid table-container'>
                          {tables == null ? '' :
                            tables.map((value, tableIndex) => {
                              return (
                                <MapElement
                                  id = {tableKeys[tableIndex]}
                                  item={value}
                                  key={tableIndex}
                                  dispatch={dispatch}
                                />
                              )
                            })
                          }
                        </div>
                      </section>
                    </div>
                  </Tab>
                )
              })}
            </Tabs>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  zones: state.zone.items,
  table: state.table.items
})

export default R.pipe(
  connect(mapStateToProps),
  isAdmin
)(MapTable)
