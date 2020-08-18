import React from 'react';
import Gravatar from 'react-gravatar'
import './UserSingle.css';

const userItem = props => (
  <li key={props.key} className="events__list-item">
    <div>
    <Gravatar email={props.username+"@gmail.com"} default="monsterid"/>
      <h1>{props.username}</h1>
    </div>
      <div>
          <button className='btn' onClick={props.followHandler.bind(this , props.userId)}> 
          Follow Me!
          </button>
      </div>

  </li>
);


export default userItem;
