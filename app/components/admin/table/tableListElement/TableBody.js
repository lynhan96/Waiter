import React, { Component } from 'react'
import R from 'ramda'

import Navigator from 'lib/Navigator'
import { showConfirmAlertDeleteItem } from '../../../../lib/actions/showNotification'
import { handleSeenContactClick } from '../../../../lib/actions/seenContactClick'
import { isAdmin } from 'components/wrappers/isAdmin'

const goto = (url) => () => Navigator.push(url)

class TableBody extends Component {
  render() {
    const { arrLink, dispatch, deleteItem, tableHeader, datas, seenItem } = this.props

    return (
      <tbody>
        {datas.map(function(item, itemIndex) {
          return (
            <tr key={itemIndex}>
              {tableHeader.map(function(headerItem, headerIndex) {
                if (headerItem.fieldName === 'isView' && item[headerItem.fieldName] === true) {
                  return <td key={headerIndex}>Có</td>
                }

                if (headerItem.fieldName === 'imageUrl') {
                  if (item[headerItem.fieldName] !== null) {
                    const key = Object.keys(item[headerItem.fieldName])

                    return (
                      <td key={headerIndex}>
                        <img src={item[headerItem.fieldName][key[0]]} style={style.imageItem}/>
                      </td>
                    )
                  } else {
                    return <td key={headerIndex}></td>
                  }
                }
                if (headerItem.fieldName === 'viewed') {
                  if (item[headerItem.fieldName]) {
                    return (
                      <td key={headerIndex}>
                        Đã xem
                      </td>
                    )
                  } else {
                    return (
                      <td key={headerIndex}>
                        Chưa xem
                      </td>
                    )
                  }
                }

                if (headerItem.fieldName === 'isView' && item[headerItem.fieldName] === false) {
                  return <td key={headerIndex}>Không</td>
                }

                return <td key={headerIndex}>{item[headerItem.fieldName]}</td>
              })}
              <td className='td-actions text-right'>
                { arrLink.view &&
                  <button onClick={goto(arrLink.view + '?index=' + itemIndex)} type='button' rel='tooltip' title='Xem thông thi tiết' className='btn btn-primary btn-simple btn-xs'>
                    <i className='material-icons'>visibility</i>
                  </button>
                }

                { arrLink.edit &&
                  <button onClick={goto(arrLink.edit + '?index=' + itemIndex)} type='button' rel='tooltip' title='Chỉnh sửa dữ liệu' className='btn btn-primary btn-simple btn-xs'>
                    <i className='material-icons'>edit</i>
                  </button>
                }

                { seenItem &&
                  <button onClick={handleSeenContactClick(seenItem, item.id, dispatch, item.viewed, 'list')} type='button' rel='tooltip' title={item.viewed ? 'Check là chưa xem' : 'Check là đã xem'} className='btn btn-primary btn-simple btn-xs'>
                    {item.viewed &&
                      <i className='material-icons'>visibility_off</i>
                    }
                    {!item.viewed &&
                      <i className='material-icons'>visibility</i>
                    }
                  </button>
                }

                <button onClick={showConfirmAlertDeleteItem(deleteItem, item.id, dispatch, itemIndex, 'list')}type='button' rel='tooltip' title='Xóa dữ liệu' className='btn btn-danger btn-simple btn-xs'>
                  <i className='material-icons'>close</i>
                </button>
              </td>
            </tr>
          )
        })}
      </tbody>
    )
  }
}

export default R.pipe(
  isAdmin
)(TableBody)

const style = {
  imageItem: {
    width: '80px',
    objectFit: 'contain'
  }
}
