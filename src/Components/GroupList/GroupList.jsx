import { useEffect, useState } from "react";
import { getDatabase, onValue, push, ref, set } from "firebase/database";
import { useSelector } from "react-redux";

const GroupList = () => {
  const db = getDatabase();
  const data = useSelector((state) => state.userLogInfo.userInfo);
  const [show, setShow] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupIntroName, setGroupIntroName] = useState("");
  const [groupNameError, setGroupNameError] = useState("");
  const [groupIntroNameError, setGroupIntroNameError] = useState("");
  const [groupList, setGroupList] = useState([]);

  // create group start

  const handleGroupName = (e) => {
    setGroupName(e.target.value);
    setGroupNameError("");
  };
  const handleIntroName = (e) => {
    setGroupIntroName(e.target.value);
    setGroupIntroNameError("");
  };
  const handleCreateGroup = () => {
    if (!groupName) {
      setGroupNameError("name is requred");
    } else if (!groupIntroName) {
      setGroupIntroNameError("introName is requred");
    } else {
      set(push(ref(db, "group")), {
        groupName: groupName,
        groupIntroName: groupIntroName,
        adminName: data.displayName,
        adminId: data.uid,
      }).then(() => {
        alert("successfully");
        setShow(false);
        setGroupName("");
        setGroupIntroName("");
      });
    }
  };

  // create group end

  // grouplist start

  useEffect(() => {
    const groupRf = ref(db, "group");
    onValue(groupRf, (snapshot) => {
      let list = [];
      snapshot.forEach((item) => {
        if (data.uid != item.val().adminId) {
          list.push({
            ...item.val(),
            id: item.key,
          });
        }
      });
      setGroupList(list);
    });
  }, []);

  // grouplist end

  // handle group join start

  const handleGroupJoin = (item) => {
    set(push(ref(db, "groupJoinRequest")), {
      groupId: item.id,
      groupName: item.groupName,
      adminId: item.adminId,
      adminName: item.adminName,
      groupIntroName: item.groupIntroName,
      userId: data.uid,
      userName: data.displayName,
    }).then(() => {
      alert("successfully");
    });
  };

  // handle group join end

  return (
    <div className="all">
      <div className="main ">
        <div className="text">
          <h2>GroupList</h2>
        </div>
        <div className="img">
          <button
            onClick={() => setShow(!show)}
            className="Button_v_4 rounded-md"
          >
            {" "}
            {show ? " cancel" : "createGroup"}{" "}
          </button>
        </div>
      </div>

      {show ? (
        <div className=" bg-blue-700 p-4 rounded-lg ">
          <input
            value={groupName}
            onChange={handleGroupName}
            type="text"
            placeholder="group name"
            className=" w-full rounded-md outline-none py-1 px-2 mb-3"
          />
          <p className=" text-red-500 font-serif text-sm ">{groupNameError}</p>
          <input
            value={groupIntroName}
            onChange={handleIntroName}
            type="text"
            placeholder="group intro"
            className=" w-full rounded-md outline-none py-1 px-2"
          />
          <p className=" text-red-500 font-serif text-sm ">
            {groupIntroNameError}
          </p>
          <button
            onClick={handleCreateGroup}
            className="Button_v_4 w-full mt-2 rounded-md"
          >
            create
          </button>
        </div>
      ) : (
        <div>
          {groupList.map((item, i) => {
            return (
              <div key={i} className="main_group">
                <div className="group">
                  <div className="profile"></div>
                  <div className="text">
                    <h2 className=" text-sm font-bold text-red-500 ">
                      {" "}
                      {item?.adminName}{" "}
                    </h2>
                    <h1 className="text-lg font-serif text-teal-600 ">
                      {" "}
                      {item?.groupName}{" "}
                    </h1>
                    <h2> {item?.groupIntroName} </h2>
                  </div>
                </div>
                <div className="btn">
                  <button
                    onClick={() => handleGroupJoin(item)}
                    className="Button_v_6"
                  >
                    join
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default GroupList;
