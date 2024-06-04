import Main from './component/Main';
import ChatBot from './component/ChatBot';
import Login from './component/Login';
import LoginMain from './component/LoginMain';
import AddMem from './component/AddMem';
import LoginChatBot from './component/LoginChatBot';
import Question from './component/Question';
import {BrowserRouter,Route,Routes} from 'react-router-dom';

function App() {
  return (
    <div className="App">
    <BrowserRouter> 
       <Routes>  

        <Route path="/" element={<Main/>} >  </Route>
        <Route path="/ChatBot" element={<ChatBot/>}> </Route> 
        <Route path="/Login" element={<Login/>}> </Route> 
        <Route path="/LoginMain" element={<LoginMain/>}> </Route>
        <Route path="/AddMem" element={<AddMem/>}> </Route> 
        <Route path="/LoginChatBot" element={<LoginChatBot/>}> </Route>
        <Route path="/LoginChatBot" element={<LoginChatBot/>}> </Route>
        <Route path="/Question" element={<Question/>}> </Route> 

       </Routes>
    </BrowserRouter> 
    </div>
  );
}

export default App;
