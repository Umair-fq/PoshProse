import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { Route, Routes } from 'react-router-dom'
import './App.css'
import Signup from './pages/Signup/Signup'
import Login from './pages/Login/Login'
import Home from './pages/Home/Home'
import AddBlog from './pages/AddBlog/AddBlog'
// import AllBlogs from './pages/AllBlogs/AllBlogs'
import BlogDetails from './pages/BlogDetails/BlogDetails'
import EditBlog from './pages/EditBlog/EditBlog'
import SearchResults from './Components/SearchResult/SearchResult'
import MyBlogs from './pages/MyBlogs/MyBlogs'
import { UserContextProvider } from './Components/Context/UserContextProvider'
import MyFavorite from './pages/MyFavorite/MyFavorite'
import EditComment from './Components/EditComment/EditComment'
import AuthHandler from './Components/Auth/AuthHandler'
import EmailVerify from './Components/EmailVerify/EmailVerify'
import UserProfile from "./pages/UserProfile/UserProfile";
import AuthorProfile from "./pages/AuthorProfile/AuthorProfile";

function App() {

  return (
    <>
      <UserContextProvider>
        <Routes>
          <Route exact path = '/verify-email/' element = {<EmailVerify />}/>
          <Route exact path = '/login' element = {<Login />}/>
          <Route exact path = '/signup' element = {<Signup />}/>
          <Route exact path = '/' element = {<Home />}/>
          <Route exact path = '/profile' element = {<UserProfile />}/>
          <Route exact path = '/create' element = {<AddBlog />}/>
          <Route exact path = '/myblogs' element = {<MyBlogs />}/>
          <Route exact path = '/auth' element={<AuthHandler />} />
          <Route exact path = '/favorites' element = {<MyFavorite />}/>
          <Route exact path = '/search' element = {<SearchResults />}/>
          <Route exact path = '/blogs/:blogId' element = {<BlogDetails />}/>
          <Route exact path = '/edit/:blogId' element = {<EditBlog />}/>
          <Route exact path = '/:blogId/editComment/:index' element = {<EditComment />}/>
          <Route path="/author/:authorId" element={<AuthorProfile />} />
        </Routes>
      </UserContextProvider>
    </>
  )
}

export default App
