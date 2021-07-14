import { Redirect, useParams } from "react-router-dom";
import ThoughtList from "../components/ThoughtList";
import FriendList from "../components/FriendList";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { QUERY_USER, QUERY_ME } from "../utils/queries";
import { ADD_FRIEND } from "../utils/mutations";

import Auth from "../utils/auth";

const Profile = () => {
  const { username: userParam } = useParams();
  const { loading, data } = useQuery(userParam ? QUERY_USER : QUERY_ME, {
    variables: { username: userParam },
  });
  console.log(Auth.getProfile().data);
  // if (Auth.loggedIn() && Auth.getProfile().data.username.toLowerCase() === userParam.toLowerCase()) {
  //   return <Redirect to="/profile" />;
  // }

  const [addFriend] = useMutation(ADD_FRIEND);

  const user = data?.me || data?.user || {};

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleClick = async () => {
    try {
      await addFriend({
        variables: { id: user._id },
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <div className="flex-row mb-3">
        <h2 className="bg-dark text-secondary p-3 display-inline-block">
          Viewing {user.username}'s profile.
        </h2>

        {userParam && (
          <button className="btn ml-auto" onClick={handleClick}>
            Add Friend
          </button>
        )}
      </div>

      <div className="flex-row justify-space-between mb-3">
        <ThoughtList
          thoughts={user.thoughts}
          title={`${user.username}'s thoughts...`}
        />

        <div className="col-12 col-lg-3 mb-3">
          <FriendList
            username={user.username}
            friendCount={user.friendCount}
            friends={user.friends}
          />
        </div>
      </div>
    </div>
  );
};

export default Profile;
