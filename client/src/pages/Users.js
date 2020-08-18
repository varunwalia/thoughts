import React, { Component } from 'react';

import AuthContext from '../context/auth-context';
import UsersList from '../components/Users/UsersList';
import Spinner from '../components/Spinner/Spinner';
import './Posts.css';

class UsersPage extends Component {
  state = {
    following: true,
    users: [],
    isLoading:false
  };

  static contextType = AuthContext;

  componentDidMount() {
    this.fetchUsers();
  }


  fetchUsers(){
    this.setState({ isLoading: true });
      const requestBody = {
                query: `
                    query{
                      users(user_id: ${this.context.userId}){
                            user_id
                            username
                          }
                        }
                  `
              };

      fetch(`http://localhost:${process.env.REACT_APP_SERVER_PORT}/graphql/`,{
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + this.context.token
            }
      })
        .then(res => {
          if (res.status !== 200 && res.status !== 201) {
            throw new Error('Failed!');
          }
          return res.json();
        })
        .then(resData => {
          const users = resData.data.users;
          this.setState({users:users , isLoading:false})
        })
        .catch(err => {
          console.log(err);
        });
  };
 

  followUserHandler = (followUserId) => {
    const requestBody = {
      query: `
      mutation{
        followUser(followInput: {followed_by: ${this.context.userId} , follow_who:${followUserId}}){
          follow_who
        }
      }
        `};

      fetch(`http://localhost:8000/graphql/`,{
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + this.context.token  
        }
        })
        .then(res => {
          if (res.status !== 200 && res.status !== 201) {
            throw new Error('Failed!');
          }
          return res.json();
        })
        .then(resData => {
          this.fetchUsers()
        })
        .catch(err => {
          console.log(err);
        });
  };

  
  


  render() {
    return (
      <React.Fragment>
        {this.state.isLoading ? (<Spinner />) :
          (<UsersList
            users={this.state.users}
            following={this.state.following}
            onFollowHandler = {this.followUserHandler}
          />)}
      </React.Fragment>
    );
  }
}
export default UsersPage;