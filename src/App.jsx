import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SignupPage from './Auth/SignUp'
import LoginPage from './Auth/Login'
import Home from './pages/Home'
import ProfilePage from './pages/Profile'
import CreatorDashboard from './CreaterDashboard/CreaterDashboard'
import CreateBlogPage from './CreaterDashboard/CreateBlog'
import EditBlogPage from './CreaterDashboard/EditBlog'
import ExplorePage from './pages/Explore'
import About from './pages/About'
import BlogDetails from './pages/BlogDetails'
import ReaderDashboard from './reader-dashboard/Reader-Dashboard'
import AdminDashboard from './admin-dashboard/AdminDashboard'
import { useMe } from './hooks/useAuthapi'
import { useAuthStore } from './store/authstore'
import { MainLayout } from './layout/MainLayout'
import FavriteBlogs from './reader-dashboard/FavriteBlogs'

const App = () => {
  const accessToken = useAuthStore((state) => state.accessToken)
  const refreshToken = useAuthStore((state) => state.refreshToken)
  const setAuth = useAuthStore((state) => state.setAuth)

  const { data: meData, isSuccess } = useMe({ enabled: !!accessToken })

  useEffect(() => {
    if (isSuccess && meData && accessToken) {
      const user = meData.user ?? meData
      setAuth({
        user,
        accessToken,
        refreshToken,
      })
    }
  }, [isSuccess, meData, accessToken, refreshToken, setAuth])

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog/:id" element={<BlogDetails />} />

          {/* Protected Routes with Sidebar Layout */}
          <Route element={<MainLayout />}>
            <Route path="/profile-setting" element={<ProfilePage />} />
            <Route path="/creater-dashboard" element={<CreatorDashboard />} />
            <Route path="/creater-blog" element={<CreateBlogPage />} />
            <Route path="/creator/edit/:id" element={<EditBlogPage />} />
            <Route path="/reader-dashboard" element={<ReaderDashboard />} />
            <Route path='/favorite-blogs' element={<FavriteBlogs />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App