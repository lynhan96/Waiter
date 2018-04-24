import React from 'react'
import { connect } from 'react-redux'

import SideBar from 'components/layout/SideBar'
import { ToastContainer } from 'react-toastify'
import Transition from 'react-transition-group/Transition'
import ButtonOrder from 'components/ButtonOrder'
import ButtonViewOrder from 'components/ButtonViewOrder'
import '../public/lib/cms/css/animate.css'
import '../public/lib/cms/css/custom.css'
import 'styles/website.less'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

const ZoomInAndOut = ({ children, position, ...props }) => (
  <Transition
    {...props}
    timeout={800}
    onEnter={ node => node.classList.add('zoomIn', 'animate')}
    onExit={node => {
      node.classList.remove('zoomIn', 'animate')
      node.classList.add('zoomOut', 'animate')
    }}
  >
    {children}
  </Transition>
)

const App = (props) => {
  const { children, signedIn } = props

  return (
     <MuiThemeProvider>
      <div className='wrapper'>
        <SideBar/>
        <div className='main-panel'>
          {children}
          {signedIn ? <ButtonOrder /> : <div/>}
          {signedIn ? <ButtonViewOrder /> : <div/>}
          <ToastContainer transition={ZoomInAndOut}/>
        </div>
      </div>
    </MuiThemeProvider>
  )
}

const mapStateToProps = (state) => state.admin

export default connect(mapStateToProps)(App)
