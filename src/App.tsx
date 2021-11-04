import  {createContext, useState, useEffect} from 'react';
import { NewRoom } from "./pages/NewRoom";
import { Home } from "./pages/Home";
import { BrowserRouter, Route } from 'react-router-dom';
import { AuthContextProvider } from './contexts/AuthContext';

import './services/firebase'

const App = () => {

  return (
    <BrowserRouter>
      <AuthContextProvider>
          <Route path="/" exact component={Home}/>
          <Route path="/rooms/new" component={NewRoom}/>
        </AuthContextProvider>
    </BrowserRouter>
  );
}



export default App;
