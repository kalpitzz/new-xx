import React, { useEffect } from 'react'
import './layout.css'
import { TopNav, Sidebar, IdleTimerContainer, Navbar } from '../components'
import { useSelector, useDispatch } from 'react-redux'
import ThemeAction from '../redux/actions/ThemeAction'
import { Outlet } from 'react-router-dom'
import { useBeforeunload } from 'react-beforeunload';






//---------Session Timeout after 30 min of closing window------------------

const resetStartTimer = () => {
  let initialTime = new Date();
  localStorage.setItem('startTime', initialTime);
  return initialTime
}


const sessionTimeCheck = () => {
  let prevTime = localStorage.getItem('startTime')
  let startTime = new Date(prevTime);
  let secsDiff = 0
  let seconds = 0
  let minutes = 0
  let sessionTimeout=process.env.REACT_APP_SESSION_TIMEOUT

  function check() {
    secsDiff = new Date().getTime() - startTime.getTime();
    seconds = Math.floor(secsDiff / 1000)
    minutes = Math.floor(seconds / 60)
    
    if (minutes >= sessionTimeout) {                 
      localStorage.clear()
      window.location.href = '/login';
    }
  }

  check()

};




//------------Layout Rendering---------------



const Layout = (props) => {
 
  let idToken = localStorage.getItem("idToken")
 
  useEffect(() => {
    if (idToken && localStorage.getItem('startTime') !== null) {
      sessionTimeCheck()
      localStorage.removeItem('startTime')
    }
    return () => localStorage.removeItem('startTime')

  }, [idToken]);

  useBeforeunload((event) => {
    resetStartTimer();
    return null
  });


  const themeReducer = useSelector((state) => state.ThemeReducer)

  const dispatch = useDispatch()

  useEffect(() => {
    const themeClass = localStorage.getItem('themeMode', 'theme-mode-light')

    const colorClass = localStorage.getItem('colorMode', 'theme-mode-light')

    dispatch(ThemeAction.setMode(themeClass))

    dispatch(ThemeAction.setColor(colorClass))
  }, [dispatch])


  return (

    <IdleTimerContainer>
      <div className={`layout ${themeReducer.mode} ${themeReducer.color}`}>
        <div className='header_div'>
          <Sidebar {...props} />
          {/* <TopNav /> */}
          <Navbar />

        </div>
        <div className="layout__content-main">
          <Outlet />
        </div>
      </div>
    </IdleTimerContainer>

  )
}

export default Layout
