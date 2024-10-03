import React, { useState } from 'react';

type UserProfileProps = {
  name: string;
  age: number;
};

const UserProfile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfileProps>({ name: 'John Doe', age: 30 });

  const updateAge = () => {
    setProfile(prevProfile => ({ ...prevProfile, age: prevProfile.age + 1 }));
  }

  return (
    <div>
      <h1>Name: {profile.name}</h1>
      <p>Age: {profile.age}</p>
      <button onClick={updateAge}>Get Older</button>
    </div>
  )
}

export default UserProfile;