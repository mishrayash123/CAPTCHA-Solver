import { Route, Routes, BrowserRouter  } from 'react-router-dom';
import Home from './components/Home'
import Footer from './components/Footer'
import Notfound from './components/Notfound';
import Login from './components/Auth/Login'
import Register from './components/Auth/Register'
import Navbar from './components/Navbar'
import "./App.css";
import { useAuth } from "./AuthContext";

function App() {
  const { isLoggedIn } = useAuth();

  return (
    <div>
      <Navbar />
<BrowserRouter>
    <Routes>
    {isLoggedIn ? (
             <>
    <Route path='/' element={<Home />}></Route>
    </>
    ) : ( 
            <>
    <Route path='/' element={<Login />}></Route>
    <Route path='/login' element={<Login />}></Route>
    <Route path='/register' element={<Register />}></Route>
            </>
             )}
             <Route path="*" element={<Notfound />} />
    </Routes>
    </BrowserRouter>
    <Footer />
    </div>
  );
}

export default App;
