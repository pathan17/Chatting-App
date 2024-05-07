import ModalImage from "react-modal-image";
import { SiIconify } from "react-icons/si";
import { AiFillFolderOpen } from "react-icons/ai";
import { AiFillAudio } from "react-icons/ai";
import { useSelector } from "react-redux";
import { useState } from "react";
import { getDatabase, onValue, push, ref, set} from "firebase/database"
import { getDownloadURL, getStorage, uploadBytesResumable, ref as sref} from "firebase/storage"

import { useEffect } from "react";
const imgUrl =
  "https://fawleybryant.com/wp-content/uploads/2021/04/020_BravesAcaDRONETandem-FINAL.jpg";

const Chating = () => {
  const activeChatName = useSelector((state) => state.activeChatSlice);
  const [message, setMessage] = useState([]);
  const db = getDatabase();
  const data = useSelector((state) => state.userLogInfo.userInfo);
  const [messageSend, setMessageSend] = useState([]);
  const storage = getStorage();

  //  handle send message start
  const handlMessageSend = () => {
    if (activeChatName.active.status == "single") {
      set(push(ref(db, "singleMassage")), {
        whoSendId: data.uid,
        whoSendName: data.displayName,
        whoReceiveId: activeChatName.active.id,
        whoReceiveName: activeChatName.active.name,
        msg: message,
        date: `${new Date().getFullYear()} - ${new Date().getMonth()} - ${new Date().getDate()} , ${
          new Date().getHours() % 12 || 12
        } :
               ${new Date().getMinutes()}  ${
          new Date().getHours() >= 12 ? "pm" : "am"
        }`,
      })
        .then(() => {
          console.log("gese");
          setMessage('')
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      console.log("group");
    }
  };

  useEffect(() => {
    onValue(ref(db, "singleMassage"), (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (
          (item.val().whoSendId == data.uid &&
            item.val().whoReceiveId == activeChatName.active?.id) ||
          (item.val().whoReceiveId == data.uid &&
            item.val().whoSendId == activeChatName.active?.id)
        ) {
          arr.push(item.val());
        }
      });
      setMessageSend(arr);
    });
  }, [activeChatName.active?.id]);

  //  handle send message end

  // handlImageUppolade start
  const handlImageUppolade = (e) => {
    const storageRef = sref(storage, e.target.files[0].name);

    const uploadTask = uploadBytesResumable(storageRef, e.target.files[0]);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
      },
      (error) => {
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          //   console.log('File available at', downloadURL);
          set(push(ref(db, "singleMassage")), {
            whoSendId: data.uid,
            whoSendName: data.displayName,
            whoReceiveId: activeChatName.active.id,
            whoReceiveName: activeChatName.active.name,
            img: downloadURL,
            date: `${new Date().getFullYear()} - ${new Date().getMonth()} - ${new Date().getDate()} , ${
              new Date().getHours() % 12 || 12
            } :
                        ${new Date().getMinutes()}  ${
              new Date().getHours() >= 12 ? "pm" : "am"
            }`,
          });
        });
      }
    );
  };

  // handlImageUppolade end
  return (
    <div>
      <div className=" relative overflow-y-scroll h-[500px] border border-red-500 rounded-lg">
        <div className=" sticky z-10 top-0 left-0 flex gap-4 items-center px-3 pt-3 border-b pb-3 border-red-700 bg-white">
          <div className="h-[70px] w-[70px] rounded-full bg-blue-700"></div>
          <div className=" text-sm font-bold text-green-400">
            <h1> {activeChatName.active?.name} </h1>
            <p>online</p>
          </div>
        </div>
        <div className="p-3">
          {activeChatName.active?.status == "single" ? (
            messageSend.map((item, i) => {
              return item.whoSendId == data.uid ? (
                item.msg ? (
                  <div key={i} className="text-right my-4">
                    <p className=" px-4 py-1 text-white bg-blue-400 inline-block rounded-lg ">
                      {" "}
                      {item.msg}{" "}
                    </p>
                    <p className="text-right text-gray-400"> {item.date} </p>
                  </div>
                ) : (
                  <div className="text-right my-4">
                    <ModalImage
                      className=" h-[200px] bg-blue-400 rounded-[4px] p-1 inline-block"
                      small={item.img}
                      large={item.img}
                      alt={imgUrl}
                    />
                    <p className="text-right text-gray-400"> {item.date} </p>
                  </div>
                )
              ) : item.msg ? (
                <div key={i} className="text-left">
                  <p className=" px-4 py-1 bg-gray-300 inline-block rounded-lg ">
                    {" "}
                    {item.msg}{" "}
                  </p>
                  <p className="text-left text-gray-400">{item.date} </p>
                </div>
              ) : (
                <div className="text-left">
                  <ModalImage
                    className=" h-[200px] bg-gray-300 rounded-[4px] p-1 inline-block"
                    small={item.img}
                    large={item.img}
                    alt={imgUrl}
                  />
                  <p className="text-left text-gray-400">{item.date}</p>
                </div>
              );
            })
          ) : (
            <h1>group</h1>
          )}

          {/* recevide audio start */}

          {/* <div className="text-left">
                        <div className="p-1 bg-gray-300 inline-block rounded-[100px] ">
                            <audio controls></audio>
                        </div>
                        <p className="text-left text-gray-400">12:24</p>
                    </div> */}

          {/* recevide audio end */}

          {/* send audio start */}

          {/* <div className="text-right my-4">
                        <div className="p-1 bg-blue-400 inline-block rounded-[100px] ">
                            <audio controls></audio>
                        </div>
                        <p className="text-right text-gray-400">12:30</p>
                    </div> */}

          {/* send audio end */}

          {/* recevide audio start */}
          {/* <div className="text-left">
                        <div className="p-1 bg-gray-300 inline-block rounded-[100px] ">
                            <audio controls></audio>
                        </div>
                        <p className="text-left text-gray-400">12:24</p>
                    </div> */}

          {/* recevide audio end */}

          {/* send audio start */}

          {/* <div className="text-right my-4">
                        <div className="p-1 bg-blue-400 inline-block rounded-[100px] ">
                            <audio controls></audio>
                        </div>
                        <p className="text-right text-gray-400">12:30</p>
                    </div> */}

          {/* send audio end */}

          {/* recevide vedio start */}
          {/* <div className="text-left">
                        <div className="p-1 bg-gray-300 inline-block rounded-lg ">
                            <video className=" rounded-lg " controls></video>
                        </div>
                        <p className="text-left text-gray-400">12:24</p>
                    </div> */}

          {/* recevide video end */}

          {/* send video start */}

          {/* <div className="text-right my-4">
                        <div className="p-1 bg-blue-400 inline-block rounded-lg ">
                            <video className=" rounded-lg " controls></video>
                        </div>
                        <p className="text-right text-gray-400">12:30</p>
                    </div> */}

          {/* send video end */}

          {/* =================================*/}

          <div className=" sticky w-full left-0 bottom-0  gap-5 bg-white mb-3">
            <div className=" flex gap-5 items-center ">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                type="text"
                placeholder="message"
                className=" p-4 w-full py-1  border border-green-500 outline-none rounded-lg "
              />
              <SiIconify className=" text-2xl text-blue-500 " />
              <AiFillAudio className=" text-2xl text-blue-500 " />
              <label>
                <input
                  onChange={handlImageUppolade}
                  type="file"
                  className="hidden"
                />
                <AiFillFolderOpen className=" text-2xl text-blue-500  " />
              </label>
              <button onClick={handlMessageSend} className="Button_v_2">
                send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chating;
