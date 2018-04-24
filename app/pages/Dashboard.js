import React, { Component } from 'react'
import R from 'ramda'

import { isAdmin } from 'components/wrappers/isAdmin'
import { updateActiveLink } from 'ducks/admin'

class Dashboard extends Component {
  componentDidMount() {
    this.props.dispatch(updateActiveLink('dashboard'))
  }

  render() {
    return (
      <div className='content'>
        <div className='container-fluid'>
          <div className='row animated fadeInUp'>
            <div className='col-lg-3 col-md-6 col-sm-6'>
              <div className='card card-stats'>
                <div className='card-header' data-background-color='orange'>
                  <i className='material-icons'>content_copy</i>
                </div>
                <div className='card-content'>
                  <p className='category'>Used Space</p>
                  <h3 className='title'>49/50
                    <small>GB</small>
                  </h3>
                </div>
                <div className='card-footer'>
                  <div className='stats'>
                    <i className='material-icons text-danger'>warning</i>
                    <a href='#pablo'>Get More Space...</a>
                  </div>
                </div>
              </div>
            </div>
            <div className='col-lg-3 col-md-6 col-sm-6'>
              <div className='card card-stats'>
                <div className='card-header' data-background-color='green'>
                  <i className='material-icons'>store</i>
                </div>
                <div className='card-content'>
                  <p className='category'>Revenue</p>
                  <h3 className='title'>$34,245</h3>
                </div>
                <div className='card-footer'>
                  <div className='stats'>
                    <i className='material-icons'>date_range</i> Last 24 Hours
                  </div>
                </div>
              </div>
            </div>
            <div className='col-lg-3 col-md-6 col-sm-6'>
              <div className='card card-stats'>
                <div className='card-header' data-background-color='red'>
                  <i className='material-icons'>info_outline</i>
                </div>
                <div className='card-content'>
                  <p className='category'>Fixed Issues</p>
                  <h3 className='title'>75</h3>
                </div>
                <div className='card-footer'>
                  <div className='stats'>
                    <i className='material-icons'>local_offer</i> Tracked from Github
                  </div>
                </div>
              </div>
            </div>
            <div className='col-lg-3 col-md-6 col-sm-6'>
              <div className='card card-stats'>
                <div className='card-header' data-background-color='blue'>
                  <i className='fa fa-twitter'></i>
                </div>
                <div className='card-content'>
                  <p className='category'>Followers</p>
                  <h3 className='title'>+245</h3>
                </div>
                <div className='card-footer'>
                  <div className='stats'>
                    <i className='material-icons'>update</i> Just Updated
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='row animated fadeInUp'>
            <div className='col-md-4'>
              <div className='card'>
                <div className='card-header card-chart' data-background-color='green'>
                  <div className='ct-chart' id='dailySalesChart'></div>
                </div>
                <div className='card-content'>
                  <h4 className='title'>Daily Sales</h4>
                  <p className='category'>
                    <span className='text-success'><i className='fa fa-long-arrow-up'></i> 55% </span> increase in today sales.
                  </p>
                </div>
                <div className='card-footer'>
                  <div className='stats'>
                    <i className='material-icons'>access_time</i> updated 4 minutes ago
                  </div>
                </div>
              </div>
            </div>
            <div className='col-md-4'>
              <div className='card'>
                <div className='card-header card-chart' data-background-color='orange'>
                  <div className='ct-chart' id='emailsSubscriptionChart'></div>
                </div>
                <div className='card-content'>
                  <h4 className='title'>Email Subscriptions</h4>
                  <p className='category'>Last Campaign Performance</p>
                </div>
                <div className='card-footer'>
                  <div className='stats'>
                    <i className='material-icons'>access_time</i> campaign sent 2 days ago
                  </div>
                </div>
              </div>
            </div>
            <div className='col-md-4'>
              <div className='card'>
                <div className='card-header card-chart' data-background-color='red'>
                  <div className='ct-chart' id='completedTasksChart'></div>
                </div>
                <div className='card-content'>
                  <h4 className='title'>Completed Tasks</h4>
                  <p className='category'>Last Campaign Performance</p>
                </div>
                <div className='card-footer'>
                  <div className='stats'>
                    <i className='material-icons'>access_time</i> campaign sent 2 days ago
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default R.pipe(
  isAdmin,
)(Dashboard)
