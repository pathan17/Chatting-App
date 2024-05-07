import { BsThreeDotsVertical } from "react-icons/bs";
import {
  getDatabase,
  onValue,
  push,
  ref,
  remove,
  set,
} from "firebase/database";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import ProfilePicture from "../ProfilePicture/ProfilePicture";

const MayGroup = () => {
  const db = getDatabase();
  const data = useSelector((state) => state.userLogInfo.userInfo);
  const [groupList, setGroupList] = useState([]);
  const [showRequest, setShowRequest] = useState(false);
  const [groupRequestJoinList, setGroupRequestJoinList] = useState([]);
  const [showGroupInfo, setShowGroupInfo] = useState(false);
  const [groupMember, setGroupMember] = useState([]);

  // my group list start
  const groupRf = ref(db, "group");
  useEffect(() => {
    onValue(groupRf, (snapshot) => {
      let list = [];
      snapshot.forEach((item) => {
        if (data.uid == item.val().adminId) {
          list.push({ ...item.val(), id: item.key });
        }
      });
      setGroupList(list);
    });
  }, []);

  // my group list end

  // handle group delet start
  const handleGroupDelet = (item) => {
    remove(ref(db, "group/" + item.id));
  };
  // handle group delet end

  // handle group request start

  const handleGroupRequest = (group) => {
    setShowRequest(!showRequest);
    const groupJoinRf = ref(db, "groupJoinRequest");
    onValue(groupJoinRf, (snapshot) => {
      let list = [];
      snapshot.forEach((item) => {
        if (data.uid == item.val().adminId && item.val().groupId == group.key) {
          list.push({ ...item.val(), key: item.key });
        }
      });
      setGroupRequestJoinList(list);
    });
  };

  // handle group request end

  // handle group accept start

  const handleGroupAccept = (item) => {
    set(push(ref(db, "groupMembers")), {
      groupId: item.groupId,
      groupName: item.groupName,
      adminId: item.adminId,
      adminName: item.adminName,
      userId: item.userId,
      userName: item.userName,
    }).then(() => {
      remove(ref(db, "groupJoinRequest/" + item.key));
    });
  };

  // handle group accept end

  // handle reject group start

  const handleRejectGroup = (item) => {
    remove(ref(db, "groupJoinRequest/" + item.key));
  };
  // handle reject group end

  // handle groupInFo start

  const handleGroupInfo = (itemInfo) => {
    setShowGroupInfo(!showGroupInfo);
    const groupMemberRf = ref(db, "groupMembers");
    onValue(groupMemberRf, (snapshot) => {
      let list = [];
      snapshot.forEach((item) => {
        if (
          data.uid === itemInfo.adminId &&
          item.val().groupId === itemInfo.id
        ) {
          list.push({ ...item.val(), key: item.key });
        }
      });
      setGroupMember(list);
    });
  };
  // handle groupInFo start
  return (
    <div className="all">
      <div className="main ">
        <div className="text">
          <h2>MayGroup</h2>
        </div>
        <div className="img">
          <BsThreeDotsVertical />
        </div>
      </div>

      {groupList.length == 0 ? (
        <h2 className=" text-center font-bold capitalize text-red-400">
          No Group
        </h2>
      ) : showRequest ? (
        <div className=" bg-blue-500 p-8 rounded-lg relative">
          <button
            onClick={() => setShowRequest(!showRequest)}
            className="Button_v_4 rounded-md absolute right-2 top-2"
          >
            close
          </button>

          {groupRequestJoinList.map((item, i) => {
            return (
              <div key={i} className="main_group bg-white p-3 rounded-lg mt-3 ">
                <div className="group">
                  <div className="profile flex justify-center items-center">
                    <ProfilePicture imgId={item.userId} />
                  </div>
                  <div className="text">
                    <h2 className=" text-sm font-bold text-red-500 ">
                      {item.userName}
                    </h2>
                  </div>
                </div>
                <div className="btn flex gap-4">
                  <button
                    onClick={() => handleGroupAccept(item)}
                    className="Button_v_5"
                  >
                    accept
                  </button>
                  <button
                    onClick={() => handleRejectGroup(item)}
                    className="Button_v_3"
                  >
                    reject
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : showGroupInfo ? (
        <div className=" bg-blue-500 p-8 rounded-lg relative">
          <button
            onClick={() => setShowGroupInfo(!showGroupInfo)}
            className="Button_v_4 rounded-md absolute right-2 top-2"
          >
            close
          </button>

          {groupMember.map((item, i) => {
            return (
              <div key={i} className="main_group bg-white p-3 rounded-lg mt-3 ">
                <div className="group">
                  <div className="profile flex justify-center items-center">
                    <ProfilePicture imgId={item?.userId} />
                  </div>
                  <div className="text">
                    <h2 className=" text-sm font-bold text-red-500 ">
                      {item.userName}
                    </h2>
                  </div>
                </div>
                <div className="btn flex gap-4">
                  <button
                    onClick={() => handleGroupAccept(item)}
                    className="Button_v_5"
                  >
                    accept
                  </button>
                  <button
                    onClick={() => handleRejectGroup(item)}
                    className="Button_v_3"
                  >
                    reject
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        groupList.map((item, i) => {
          return (
            <div key={i} className="main_group">
              <div className="group">
                <div className="profile flex justify-center items-center">
                  <h2 className="text-white font-bold text-lg uppercase">
                    {" "}
                    {item.adminName[0]}{" "}
                  </h2>
                </div>
                <div className="text">
                  <h2 className=" text-sm font-bold text-red-500 ">
                    {item.adminName}
                  </h2>
                  <h3 className="text-lg font-serif text-teal-600 ">
                    {item.groupName}
                  </h3>
                  <h2>{item.groupIntroName}</h2>
                </div>
              </div>
              <div className="btn flex gap-3">
                <button
                  onClick={() => handleGroupInfo(item)}
                  className="Button_v_5"
                >
                  info
                </button>
                <button
                  onClick={() => handleGroupRequest(item)}
                  className="Button_v_3"
                >
                  request
                </button>
                <button
                  onClick={() => handleGroupDelet(item)}
                  className="Button_v_4"
                >
                  delete
                </button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default MayGroup;
