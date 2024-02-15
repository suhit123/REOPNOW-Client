import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Starter from './Starter';
import Call from './Call';
import './styles/starter.css'
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Starter/>}/>
        <Route path="/call" element={<Call/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
