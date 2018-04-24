import React from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { dispatchLogout } from 'ducks/admin'

const SideBar = (props) => {
  const { admin, foodCategory, dispatch } = props
  const { activeLink, signedIn } = admin
  const { items } = foodCategory
  const logout = dispatchLogout(dispatch)

  if (signedIn) {
    return (
      <div className='sidebar slde-bar-bg-image' data-color='purple'>
        <div className='logo'>
          <Link to='dashboard' className='simple-text'>
            BK Food
          </Link>
        </div>
        <div className='sidebar-wrapper'>
          <ul className='nav'>
            <li className={activeLink === 'map-tables' ? 'active' : ''}>
              <Link to='map-tables'>
                <i className='material-icons'>map</i>
                <p>Sơ đồ nhà hàng</p>
              </Link>
            </li>
            <li className={activeLink === 'order-food' ? 'active' : ''}>
              <Link to='order-food'>
                <i className="material-icons">contact_mail</i>
                <p>Thực đơn</p>
              </Link>
              <ul className='sub-menu'>
                {items.map((item, index) =>
                  <li key={index}>
                    <Link to={'foods?index=' + index}>{item.name}</Link>
                  </li>
                )}
              </ul>
            </li>
            <li>
              <Link to='#' onClick={e => { e.preventDefault(); logout() }}>
                <i className='material-icons'>subdirectory_arrow_right</i>
                <p>Thoát</p>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    )
  } else {
    return (<div/>)
  }
}

const mapStateToProps = (state) => ({
  admin: state.admin,
  foodCategory: state.foodCategory
})

export default connect(mapStateToProps)(SideBar)
