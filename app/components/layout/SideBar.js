import React from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { dispatchLogout } from 'ducks/admin'

const SideBar = (props) => {
  const { signedIn, dispatch, activeLink } = props
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
            <li className={activeLink === 'dashboard' ? 'active' : ''}>
              <Link to='dashboard'>
                <i className='material-icons'>dashboard</i>
                <p>Trang chủ</p>
              </Link>
            </li>
            <li className={activeLink === 'order-food' ? 'active' : ''}>
              <Link to='order-food'>
                <i className='material-icons'>map</i>
                <p>Đặt món</p>
              </Link>
            </li>
            <li className={activeLink === 'map-tables' ? 'active' : ''}>
              <Link to='map-tables'>
                <i className='material-icons'>map</i>
                <p>Sơ đồ nhà hàng</p>
              </Link>
            </li>
            <li className={activeLink === 'employees' ? 'active' : ''}>
              <Link to='employees'>
                <i className='material-icons'>account_circle</i>
                <p>Nhân viên</p>
              </Link>
            </li>
            <li className={activeLink === 'users' ? 'active' : ''}>
              <Link to='users'>
                <i className='material-icons'>assignment_ind</i>
                <p>Khách hàng</p>
              </Link>
            </li>
            <li className={activeLink === 'food-categories' ? 'active' : ''}>
              <Link to='food-categories'>
                <i className='material-icons'>content_paste</i>
                <p>Danh mục thức ăn</p>
              </Link>
            </li>
            <li className={activeLink === 'foods' ? 'active' : ''}>
              <Link to='foods'>
                <i className='material-icons'>view_module</i>
                <p>Thực đơn</p>
              </Link>
            </li>
            <li className={activeLink === 'orderings' ? 'active' : ''}>
              <Link to='orderings'>
                <i className='material-icons'>shopping_cart</i>
                <p>Hóa đơn</p>
              </Link>
            </li>
            <li className={activeLink === 'events' ? 'active' : ''}>
              <Link to='events'>
                <i className="material-icons">card_giftcard</i>
                <p>Sự kiện</p>
              </Link>
            </li>
            <li className={activeLink === 'contacts' ? 'active' : ''}>
              <Link to='contacts'>
                <i className="material-icons">contact_mail</i>
                <p>Liên hệ</p>
              </Link>
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

const mapStateToProps = (state) => state.admin

export default connect(mapStateToProps)(SideBar)
