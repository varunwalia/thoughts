import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';

import AuthPage from './pages/Auth';
import UsersPage from './pages/Users';
import PostsPage from './pages/Posts';
import MainNavigation from './components/navigation/MainNavigation';
import AuthContext from './context/auth-context';

import './App.css';

class App extends Component {
  state = {
    token: null,
    userId: null
  };

  login = (token, userId, tokenExpiration) => {
    this.setState({ token: token, userId: userId });
  };

  logout = () => {
    this.setState({ token: null, userId: null });
  };

  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          <AuthContext.Provider
            value={{
              token: this.state.token,
              userId: this.state.userId,
              login: this.login,
              logout: this.logout
            }}
          >
            <MainNavigation />
            <main className="main-content">
              <Switch>
              
              {!this.state.token && (
                  <Route path="/auth" component={AuthPage} />
                )}
                {!this.state.token && <Redirect  to="/auth" exact />}
                {this.state.token && <Redirect from="/auth" to="/posts" exact />}
                
                <Route path="/posts" component={PostsPage} />
                {this.state.token && (
                  <Route path="/users" component={UsersPage} />
                )}
                 
              </Switch>
            </main>
          </AuthContext.Provider>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default App;

