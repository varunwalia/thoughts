import React from 'react';


import './PostSingle.css';

const postItem = props => (
  <li key={props.eventId} className="posts__list-item">
    <div>
      <h1>{props.title}</h1>
        <h2> 
            {props.description}
        </h2>
    </div>
    <div>
      <p>{props.username} </p>
      <p>{props.date}</p>
        {props.userId!==props.currUser ?
        (<button className="btn" onClick={props.unfollowHandler.bind(this , props.userId)}>
          Unfollow
        </button>) : (<p></p>)}
    </div>
  </li>
);

export default postItem;
