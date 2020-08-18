import React, { Component } from 'react';
import SimpleReactValidator from 'simple-react-validator';

import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';
import AuthContext from '../context/auth-context';
import PostsList from '../components/Posts/Posts';
import Spinner from '../components/Spinner/Spinner';
import './Posts.css';



class PostsPage extends Component {
  state = {
    creating: false,
    posts: [],
    isLoading:false,
    title: '',
    description:' '
  };

  static contextType = AuthContext;

  constructor(props) {
    super(props);
this.validator = new SimpleReactValidator();

  }

  componentDidMount() {
    this.fetchPosts();
  }

  handleTitleChange = (e)=>{
    this.setState({title: e.target.value})
  }
  handleDescriptionChange = (e)=>{
    this.setState({description: e.target.value})
  }
  startCreateEventHandler = () => {
    this.setState({ creating: true });
  };

  modalConfirmHandler = () => {
    // event.preventDefault();
    this.setState({ creating: false });
    if (!this.validator.allValid()) {
      this.validator.showMessages();
      this.forceUpdate();
    }
    const title = this.state.title;
    const description = this.state.description;
    if (
        title.trim().length === 0 ||
        description.trim().length === 0
      ) {
        return;
      }

    const event = { title,description };

    const requestBody = {
      query: `
          mutation {
            createPost(postInput: {user_id: ${this.context.userId} , title: "${title}", description: "${description}"}) {
              title
            }
          }
        `
    };

    const token = this.context.token;
    

    fetch(`http://localhost:${process.env.REACT_APP_SERVER_PORT}/graphql/`,{
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token  
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        this.fetchPosts();
      })
      .catch(err => {
        console.log(err);
      });
  };

  modalCancelHandler = () => {
    this.setState({ creating: false });
  };

  fetchPosts(){
    this.setState({ isLoading: true });
      const requestBody = {
                query: `
                    query{
                      posts(user_id: ${this.context.userId}){
                            title
                            username
                            user_id
                            postDate
                            description
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
          const posts = resData.data.posts;
          this.setState({posts:posts , isLoading:false})
        })
        .catch(err => {
          console.log(err);
        });
  };
 


  unfollowUserHandler = (followUserId) => {
    const requestBody = {
      query: `
      mutation{
        unfollowUser(followInput: {followed_by: ${this.context.userId} , follow_who:${followUserId}}){
          follow_who
        }
      }
      `};

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
        this.fetchPosts()  
      })
      .catch(err => {
        console.log(err);
      });
  };
  

  render() {
    return (
      <React.Fragment>
        {this.state.creating && <Backdrop />}
        {this.state.creating && (
          <Modal
            title="Add Event"
            canCancel
            canConfirm
            onCancel={this.modalCancelHandler}
            onConfirm={this.modalConfirmHandler}
          >
            <form onSubmit={this.modalConfirmHandler}>
              <div className="form-control">
                <label htmlFor="title">Title</label>
                <input type="text" id="title" onChange={this.handleTitleChange} />
          {this.validator.message('title', this.state.title, 'required|min:1|max:20', { className: 'text-danger' })}

              </div>
              <div className="form-control">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  rows="4"
                  onChange={this.handleDescriptionChange}
                />
          {this.validator.message('tweet', this.state.description, 'required|min:1|max:120', { className: 'text-danger' })}

              </div>
 
            </form>
          </Modal>
        )}
        {this.context.token && (
          <div className="events-control">
            <p>Share your own Events!</p>
            <button className="btn" onClick={this.startCreateEventHandler}>
              Create Event
            </button>
          </div>
        )}
        {this.state.isLoading ? (<Spinner />) :
          (<PostsList
            posts={this.state.posts}
            authUserId={this.context.userId}
            onViewDetail={this.showDetailHandler}
            onUnfollowHandler = {this.unfollowUserHandler}
          />)}
      </React.Fragment>
    );
  }
}


export default PostsPage;