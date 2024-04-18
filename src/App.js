import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css';
import Login from './Components/Login';
import AdminHome from './Components/AdminHome';
import Header from './Components/Header';
import Register from './Components/Register';
import ViewAllUsers from './Components/ViewAllUsers';
import StudentHome from './Components/StudentHome';
import ManagerHome from './Components/ManagerHome';
import EditStudent from './Components/EditStudent';
import PasswordStd from './Components/PasswordStd';
import EditManager from './Components/EditManager';
import StudUnderManager from './Components/StudUnderManager';
import PasswordManager from './Components/PasswordManager';


function App() {
  return (
    <div className="App">
      <BrowserRouter >
        <Header />
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/adminhome' element={<AdminHome />} />
          <Route path='/register' element={<Register />} />
          <Route path='/viewalluser' element={<ViewAllUsers />} />
          <Route path='/studenthome' element={<StudentHome />} />
          <Route path='/ManagerHome' element={<ManagerHome />} />
          <Route path='/editstd' element={<EditStudent />} />
          <Route path='/passwordstd' element={<PasswordStd />} />
          <Route path='/editmanager' element={<EditManager />} />
          <Route path='/studundermanager' element={<StudUnderManager />} />
          <Route path='/passwordmanager' element={<PasswordManager />} />


        </Routes >
      </BrowserRouter >
    </div>
  );
}

export default App;
