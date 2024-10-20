import React from 'react';

const UserNameForm = (props) => {
  return (
    <form onSubmit={props.nameSubmit}>
      <input 
        onChange={props.enterName} 
        value={props.userName} 
        placeholder="Enter your name" 
      />
      <button>Submit</button>
    </form>
  );
};

export default UserNameForm;
