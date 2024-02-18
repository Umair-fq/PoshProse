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

function App() {

  return (
    <>
      <UserContextProvider>
        <Routes>
          <Route exact path = '/login' element = {<Login />}/>
          <Route exact path = '/signup' element = {<Signup />}/>
          <Route exact path = '/' element = {<Home />}/>
          <Route exact path = '/create' element = {<AddBlog />}/>
          <Route exact path = '/myblogs' element = {<MyBlogs />}/>
          <Route exact path = '//favorites' element = {<MyFavorite />}/>
          <Route exact path = '/search' element = {<SearchResults />}/>
          <Route exact path = '/blogs/:blogId' element = {<BlogDetails />}/>
          <Route exact path = '/edit/:blogId' element = {<EditBlog />}/>
          <Route exact path = '/:blogId/editComment/:index' element = {<EditComment />}/>
        </Routes>
      </UserContextProvider>
    </>
  )
}

export default App
