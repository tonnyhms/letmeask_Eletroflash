import  {createContext, useState, useEffect} from 'react';
import { NewRoom } from "./pages/NewRoom";
import { Home } from "./pages/Home";
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { AuthContextProvider } from './contexts/AuthContext';

import './services/firebase'
import { Room } from './pages/Room';

const App = () => {

  return (
    <BrowserRouter>
      <AuthContextProvider>
        <Switch>
          <Route path="/" exact component={Home}/>
          <Route path="/rooms/new" component={NewRoom}/>
          <Route path="/rooms/:id" component={Room}/>
        </Switch>
      </AuthContextProvider>
    </BrowserRouter>
  );
}



export default App;
