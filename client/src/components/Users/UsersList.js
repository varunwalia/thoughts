import React from 'react';

import UserSingle from './UserSingle';
import './Users.css';

// class BookingsPage extends Component {
  // 
const postList = (props) => {
  const users = props.users.map(user => {
    return (
      <UserSingle
        key={user.user_id}
        userId={user.user_id}
        username={user.username}
        following={props.following}
        followHandler = {props.onFollowHandler}
      />
    );
  });

  return <ul className="event__list">{users}</ul>;
};
// }
export default postList;


