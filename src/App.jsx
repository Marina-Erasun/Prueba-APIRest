import {React} from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import ListWomen from '../src/Women/Women';
import Login from './Pages/Login';

function App() {
  return (
    <>
    <BrowserRouter>
    <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/women" element={<ListWomen />}/>
    </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
