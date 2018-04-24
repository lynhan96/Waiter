import React, {Component} from 'react'
import R from 'ramda'
import { connect } from 'react-redux'

import { isAdmin } from 'components/wrappers/isAdmin'

class Profile extends Component {
  render() {
    return (
      <div className='content'>
        <div className='container-fluid animated fadeIn'>
          <div className='row'>
            <div className='col-md-8'>
              <div className='card'>
                <div className='card-header' data-background-color='purple'>
                  <h4 className='title'>Thông tin cá nhân</h4>
                </div>
                <div className='card-content'>
                  <form>
                    <div className='row'>
                      <div className='col-md-6'>
                        <div className='form-group label-floating'>
                          <label className='control-label'>Tên</label>
                          <input type='text' className='form-control'/>
                        </div>
                      </div>
                      <div className='col-md-6'>
                        <div className='form-group label-floating'>
                          <label className='control-label'>Email</label>
                          <input type='text' className='form-control'/>
                        </div>
                      </div>
                    </div>
                    <button type='submit' className='btn btn-primary pull-right'>Cập nhập thông tin</button>
                    <div className='clearfix'></div>
                  </form>
                </div>
              </div>
            </div>
            <div className='col-md-4'>
              <div className='card card-profile'>
                <div className='card-avatar'>
                  <a>
                    <img className='img' src='images/avatar5.png' />
                  </a>
                </div>
                <div className='content'>
                  <h6 className='category text-gray'>CEO / Co-Founder</h6>
                  <h4 className='card-title'>Alec Thompson</h4>
                  <p className='card-content'>
                    Don't be scared of the truth because we need to restart the human foundation in truth And I love you like Kanye loves Kanye I love Rick Owens’ bed design but the back is...
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  vendorInfo: state.admin
})

export default R.pipe(
  connect(mapStateToProps),
  isAdmin
)(Profile)
