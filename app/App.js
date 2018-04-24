import React from 'react'

import SideBar from 'components/layout/SideBar'
import { ToastContainer } from 'react-toastify'
import Transition from 'react-transition-group/Transition'
import '../public/lib/cms/css/animate.css'
import '../public/lib/cms/css/custom.css'

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
  const { children } = props

  return (
     <MuiThemeProvider>
      <div className='wrapper'>
        <SideBar/>
        <div className='main-panel'>
          {children}
          <ToastContainer transition={ZoomInAndOut}/>
        </div>
      </div>
    </MuiThemeProvider>
  )
}

export default App
