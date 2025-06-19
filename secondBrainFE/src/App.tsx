import {Dashboard} from "./pages/dashboard";
import { Signin } from "./pages/signin";
import { Signup } from "./pages/signup";
import { SharedBrainPage } from './pages/sharedPage';
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App(){
  return <BrowserRouter>
      <Routes>
        <Route path="/" element={<Signup/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/signin" element={<Signin/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
         <Route path="/share/:hash" element={<SharedBrainPage />} />
      </Routes>
  </BrowserRouter>
} 

export default App