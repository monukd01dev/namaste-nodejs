import { BrowserRouter, Routes, Route } from 'react-router'
import Main from './components/Main'
import Login from './components/Login'
import SignUp from './components/SignUp'
import Profile from './components/Profile'
import GuestRoute from './guards/GuestRoute'
import ProtectedRoute from './guards/ProtectedRoute'
function App() {

  return (
    <>
      <BrowserRouter basename='/app'>
        <Routes>
          <Route path='/' element={<Main />}>
            <Route
              path='/login'
              element={
                <GuestRoute>
                  <Login/>
                </GuestRoute>
              } />
            <Route
              path='/signup'
              element={<SignUp />}
            />
            <Route
              path='/profile'
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
          </Route>
        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
