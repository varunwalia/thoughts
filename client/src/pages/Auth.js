import React, { Component } from 'react';
import './Auth.css';
import AuthContext from '../context/auth-context';
import SimpleReactValidator from 'simple-react-validator';

class AuthPage extends Component {

  state = {
    isLogin:true,
    email: '',
    password:'',
    signupEmail: '',
    signupUsername:'',
    signupPassword: '',
  };

  static contextType = AuthContext;


  constructor(props){
    super(props)
    this.signinValidator = new SimpleReactValidator();
    this.signupValidator = new SimpleReactValidator();

  }


  handleEmailChange = (e)=>{
    this.setState({email: e.target.value})
  }
  handlePasswordChange = (e)=>{
    this.setState({password: e.target.value})
  }
  handleSignupUsernameChange = (e)=>{
    this.setState({signupUsername: e.target.value})
  }
  handleSignupEmailChange = (e)=>{
    this.setState({signupEmail: e.target.value})
  }
  handleSignupPasswordChange = (e)=>{
    this.setState({signupPassword: e.target.value})
  }

  switchModeHandler = () => {
    this.setState(prevState => {
      return { isLogin: !prevState.isLogin };
    });
  };

  signInHandler = (event)=>{
    event.preventDefault();
    if (!this.signinValidator.allValid()) {
      this.signinValidator.showMessages();
      this.forceUpdate();
    }
  
    const email = this.state.email;
    const password = this.state.password;
    if(email.trim().lenght===0 || password.trim().lenght===0){
      return;
    }


    let requestBody = {
      query: `
        query {
          login(email: "${email}", password: "${password}") {
            userId
            token
            tokenExpiration
          }
        }
      `
    };

    fetch(`http://localhost:${process.env.REACT_APP_SERVER_PORT}/graphql/`,{
      method: 'POST',
      body:JSON.stringify(requestBody),
      headers:{
        'Content-Type':'application/json'
      }

    }).then(res => {
        if (res.status!==200 && res.status!==201)
        {
          return new  Error("Request Failed")
        }
        return res.json()
    })
    .then(resData => {
    if (resData.data.login.token){
        this.context.login(resData.data.login.token , resData.data.login.userId , resData.data.login.tokenExpiration)
      }
    })
    .catch(err =>{
      console.log(err)
    })
  };
  
signUpHandler = (event)=>{
    event.preventDefault();
    if (this.signupValidator.allValid()) {
      alert('Your account has been created use the other form to login!');
    } else {
      this.signupValidator.showMessages();
      this.forceUpdate();
    }

    const username =  this.state.signupUsername ;
    const email = this.state.signupEmail;
    const password = this.state.signupPassword;

    if(email.trim().lenght===0 || password.trim().lenght===0){
      return;
    }


    const requestBody = {
        query: `
          mutation {
            createUser(userInput: {username: "${username}" , email: "${email}", password: "${password}"}) {
              email
            }
          }
        `
      };
   
    fetch(`http://localhost:${process.env.REACT_APP_SERVER_PORT}/graphql/`,{
      method: 'POST',
      body:JSON.stringify(requestBody),
      headers:{
        'Content-Type':'application/json'
      }

    }).then(res => {
      // console.log(res.status)
        if (res.status!==200 && res.status!==201)
        {
          return new  Error("Request Failed")
        }
        return res.json()
    })
    .then(resData => {
      return resData
    })
    .catch(err =>{
      console.log(err)
    })
  };

  render() {
    return (
      <div className='row'>
        <div className='col-6'>
      <form className="auth-form" onSubmit={this.signInHandler}>
        <div className="form-control">
          <label htmlFor="email">E-Mail</label>

          <input type="email" id="email" ref={this.emailEl} onChange={this.handleEmailChange}/>
          {this.signinValidator.message('email', this.state.email, 'required|email', { className: 'text-danger' })}
        </div>
        <div className="form-control">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" ref={this.passwordEl} onChange={this.handlePasswordChange}/>
        </div>
        <div className="form-actions">
          <button type="button" onClick={this.signInHandler}>
            Login
          </button>
        </div>
      </form>
      </div>
      <div className='col-6'>
      <form className="auth-form" onSubmit={this.signUpHandler} noValidate>
        <div className="form-control">
          <label htmlFor="username">UserName</label> 
          <input type="name" id="username" onChange={this.handleSignupUsernameChange}/>
          {this.signupValidator.message('username', this.state.signupUsername, 'required|alpha_num', { className: 'text-danger' })}
        </div> 
        <div className="form-control">
          <label htmlFor="email">E-Mail</label>
          <input type="email" id="email" onChange={this.handleSignupEmailChange} required/>
          {this.signupValidator.message('email', this.state.signupEmail, 'required|email', { className: 'text-danger' })}

        </div>
        <div className="form-control">
          <label htmlFor="password">Password</label>
          <input type="password" id="password"  onChange={this.handleSignupPasswordChange} required/>

        </div>
        <div className="form-actions">
          <button type="button" onClick={this.signUpHandler}>
            Signup
          </button>
        </div>
      </form>
      </div>
      </div>
    );
  }
}

export default AuthPage;   