import Navbar from './Navbar'
import Footer from './Footer'
import { Outlet } from 'react-router'
function Main() {
  return (
    <div className='flex flex-col h-screen'>
      <Navbar />
      <div className="grow">
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}

export default Main
