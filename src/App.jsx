import React from 'react'
import Main from './components/main'
import { Route, Routes } from 'react-router-dom'
import Dashboard from './components/dashboard'
import Analytics from './components/analytics'
import ProtectedRoutes from './protectedRoute'

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={ <Main /> }></Route>
        <Route element={ <ProtectedRoutes /> } >
          <Route path="/dashboard" element={ <Dashboard /> } />
          <Route path="/dashboard/analytics" element={ <Analytics latitude={ 52.50517521 } longitude={ 13.33630812 } /> }></Route>
        </Route>

      </Routes>
    </>
  )
}

export default App