import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminEvent from './Pages/Admin Event Page/adminEvent';
import AdminItem from './Pages/Admin Item Page/adminItem';
import AdminProfile from './Pages/Admin Profile Page/adminProfile';
import BookCatalog from './Pages/Book Catalog Page/bookCatalog';
import EventPage from './Pages/Events Page/eventPage';
import HomePage from './Pages/Home Page/homePage';
import LoginPage from './Pages/Login Page/loginPage';
import MusicCatalog from './Pages/Music Catalog Page/musicCatalog';
import SignUpPage from './Pages/SignUp Page/signUpPage';
import TechCatalog from './Pages/Technology Catalog Page/techCatalog';
import UserProfile from './Pages/User Profile Page/userProfile';
import BookDetails from './Pages/Book Detail Page/BookDetails'
import MusicDetails from './Pages/Music Detail Page/MusicDetail';
import TechDetail from './Pages/Tech Detail Page/TechDetail';
import ProtectedRoutes from './utils/ProtectedRoutes';
function App() {
  return (
    <Router>
      <Routes>
        <Route element={<ProtectedRoutes/>}>
        <Route path='/AdminEvent' element={<AdminEvent/>}/>
        <Route path='/AdminItem' element={<AdminItem/>}/>
        <Route path='/AdminProfile' element={<AdminProfile/>}/>
        </Route>
        
        <Route path='/Books' element={<BookCatalog/>}/>
        <Route path='/Events' element={<EventPage/>}/>
        <Route path='/' element={<HomePage/>}/>
        <Route path='/Login' element={<LoginPage/>}/>
        <Route path='/Music' element={<MusicCatalog/>}/>
        <Route path='/Signup' element={<SignUpPage/>}/>
        <Route path='/Technology' element={<TechCatalog/>}/>
        <Route path='/Profile' element={<UserProfile/>}/>
        <Route path='/Books/:id' element={<BookDetails/>}/>
        <Route path='/Music/:id' element={<MusicDetails/>}/>
        <Route path='/Tech/:id' element={<TechDetail/>}/>
        
        
      </Routes>
    </Router>
  );
}

export default App;
