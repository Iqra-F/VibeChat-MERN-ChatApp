import {Route,Routes} from 'react-router-dom';
import Home from './pages/Home';
import Chat from './pages/Chat';
import './index.css';
function App() {
  return (
   <div className=" h-[80vh]">
    <Routes>
    <Route path='/' element={<Home/>}/>
    <Route path='/chats' element={<Chat/>}/>
    </Routes>
   </div>
  );
}

export default App;
