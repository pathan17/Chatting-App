import { BsThreeDotsVertical } from "react-icons/bs";
import { getDatabase, onValue, push, ref, set } from "firebase/database";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ProfilePicture from "../ProfilePicture/ProfilePicture";

const UserList = () => {
  const db = getDatabase();
  let [userList, setUserList] = useState([]);
  let [friendRequest, setFriendRequest] = useState([]);
  const data = useSelector((state) => state.userLogInfo.userInfo);
  let [friendList, setFriendList] = useState([]);
  let [searchUser, setSearchUser] = useState([]);

  // UserList information start

  useEffect(() => {
    const useRef = ref(db, "users");
    onValue(useRef, (snapshot) => {
      let list = [];
      snapshot.forEach((item) => {
        if (data.uid !== item.key) {
          list.push({ ...item.val(), id: item.key });
        }
      });

      setUserList(list);
    });
  }, []);

  // UserList information end

  // addfriend information strat
  const handleFriendRequest = (item) => {
    set(push(ref(db, "frendRequest")), {
      senderId: data.uid,
      senderName: data.displayName,
      receverId: item.id,
      receverName: item.username,
    });
  };

  // addfriend information end

  // addfriend useEffect information start
  useEffect(() => {
    const handleFriendRequestRef = ref(db, "frendRequest");
    onValue(handleFriendRequestRef, (snapshot) => {
      let request = [];
      snapshot.forEach((item) => {
        request.push(item.val().receverId + item.val().senderId);
      });
      setFriendRequest(request);
    });
  }, []);
  // addfriend useEffect information end

  // friend collection friend list theke start
  useEffect(() => {
    const friendLisRef = ref(db, "friends");
    onValue(friendLisRef, (snapshot) => {
      let list = [];
      snapshot.forEach((item) => {
        list.push(item.val().receverId + item.val().senderId);
      });
      setFriendList(list);
    });
  }, []);

  // friend collection friend list theke end

  // handale seach start

  const handleSearch = (e) => {
    let arr = [];
    userList.filter((item) => {
      if (item.username.toLowerCase().includes(e.target.value.toLowerCase())) {
        arr.push(item);
      }

      setSearchUser(arr);
    });
  };

  // handale seach end

  return (
    <div className="all">
      <div className="main ">
        <div className="text">
          <h2>user list</h2>
        </div>
        <div>
          <input
            onChange={handleSearch}
            type="text"
            placeholder="search"
            className=" border border-1 border- border-blue-600 outline-none p-1 rounded-lg "
          />
        </div>
        <div className="img">
          <BsThreeDotsVertical />
        </div>
      </div>

      {searchUser.length > 0
        ? searchUser.map((item, i) => {
            return (
              <div key={i} className="main_group">
                <div className="group">
                  <div className="profile">
                    <ProfilePicture imgId={item?.id} />
                  </div>
                  <div className="text">
                    <h1> {item?.username} </h1>
                    <h2> {item?.email} </h2>
                  </div>
                </div>
                <div className="btn">
                  {friendList.includes(item?.id + data?.uid) ||
                  friendList.includes(data?.uid + item?.id) ? (
                    <button className="Button_v_2">friend</button>
                  ) : friendRequest.includes(item?.id + data?.uid) ||
                    friendRequest.includes(data?.uid + item?.id) ? (
                    <button className="Button_v_2">panding...</button>
                  ) : (
                    <button
                      onClick={() => handleFriendRequest(item)}
                      className="Button_v_2"
                    >
                      addfriend
                    </button>
                  )}
                </div>
              </div>
            );
          })
        : userList.map((item, i) => {
            return (
              <div key={i} className="main_group">
                <div className="group">
                  <div className="profile">
                    <ProfilePicture imgId={item?.id} />
                  </div>
                  <div className="text">
                    <h1> {item?.username} </h1>
                    <h2> {item?.email} </h2>
                  </div>
                </div>
                <div className="btn">
                  {friendList.includes(item?.id + data?.uid) ||
                  friendList.includes(data?.uid + item?.id) ? (
                    <button className="Button_v_2">friend</button>
                  ) : friendRequest.includes(item?.id + data?.uid) ||
                    friendRequest.includes(data?.uid + item?.id) ? (
                    <button className="Button_v_2">panding...</button>
                  ) : (
                    <button
                      onClick={() => handleFriendRequest(item)}
                      className="Button_v_2"
                    >
                      addfriend
                    </button>
                  )}
                </div>
              </div>
            );
          })}
    </div>
  );
};

export default UserList;
