import React, { Component } from 'react'
import R from 'ramda'

import { isAdmin } from 'components/wrappers/isAdmin'
import { updateActiveLink } from 'ducks/admin'
import 'styles/website.less'

class OrderFood extends Component {
  componentDidMount() {
    this.props.dispatch(updateActiveLink('order-food'))
  }

  render() {
    return (
      <div className='content'>
        <div className='container-fluid main-navigation' style={{ height: '100vh' }}>
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">Front End Design</a>
              <ul>
                <li><a href="#">HTML</a></li>
                <li><a href="#">CSS</a>
                  <ul>
                    <li><a href="#">Resets</a></li>
                    <li><a href="#">Grids</a></li>
                    <li><a href="#">Frameworks</a></li>
                  </ul>
                </li>
                <li><a href="#">JavaScript</a>
                  <ul>
                    <li><a href="#">Ajax</a></li>
                    <li><a href="#">jQuery</a></li>
                  </ul>
                </li>
              </ul>
            </li>
            <li><a href="#">WordPress Development</a>
              <ul>
                <li><a href="#">Themes</a></li>
                <li><a href="#">Plugins</a></li>
                <li><a href="#">Custom Post Types</a>
                  <ul>
                    <li><a href="#">Portfolios</a></li>
                    <li><a href="#">Testimonials</a></li>
                  </ul>
                </li>
                <li><a href="#">Options</a></li>
              </ul>
            </li>
            <li><a href="#">About Us</a></li>
          </ul>
        </div>
      </div>
    )
  }
}

export default R.pipe(
  isAdmin,
)(OrderFood)
