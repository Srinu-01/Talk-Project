import './App.css';
import Footer from './components/Includes/Footer';
import Posts from './components/Posts/Posts'
import NewPost from './components/Posts/NewPost'
import User from './components/User/User'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SearchBar from './components/Posts/Search';
import ShowUser from './components/User/SearchUserProfile';
import Followers from './components/User/Followers';

function App() {
  return (
    <Router>
      <>
        <Routes>
          <Route path="/" element={<Posts/>} />
          <Route path="/talk" element={<Posts/>} />
          <Route path="/user/:id" element={<ShowUser />} />
          <Route path="/user/followers/:id" element={<Followers />} />
          <Route path="/talk/search" element={<SearchBar/>} />
          <Route path="/talk/user" element={<User/>} />
          <Route path="/talk/new" element={<NewPost/>} />
        </Routes>
        <Footer />
      </>
    </Router>
  );
}

export default App;
