import { AiTwotoneHome } from "react-icons/ai";
import { RiMessage3Fill } from "react-icons/ri";
import { IoNotificationsSharp } from "react-icons/io5";
import { RiLogoutCircleLine } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signOut, updateProfile } from "firebase/auth";
import { userLogInfo } from "../../Slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { MdOutlineCloudDownload } from "react-icons/md";
import { createRef, useState } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadString,
} from "firebase/storage";

const Navbar = () => {
  const auth = getAuth();
  const Navigate = useNavigate();
  const dispatch = useDispatch();
  const storage = getStorage();

  //  croper information start
  const [image, setImage] = useState("");
  const [cropData, setCropData] = useState("#");
  console.log(cropData);
  const cropperRef = createRef();

  const handaleProfile = (e) => {
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    console.log(files);
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
      console.log(reader.result);
    };
    reader.readAsDataURL(files[0]);
  };

  const getCropData = () => {
    if (typeof cropperRef.current?.cropper !== "undefined") {
      setCropData(cropperRef.current?.cropper.getCroppedCanvas().toDataURL());
      const storageRef = ref(storage, auth.currentUser.uid);
      const message4 = cropperRef.current?.cropper
        .getCroppedCanvas()
        .toDataURL();
      uploadString(storageRef, message4, "data_url").then((snapshot) => {
        // console.log('Uploaded a data_url string!');
        getDownloadURL(storageRef).then((downloadURL) => {
          updateProfile(auth.currentUser, {
            photoURL: downloadURL,
          });
          dispatch(userLogInfo({ ...data, photoURL: downloadURL }));
          localStorage.setItem(
            "user",
            JSON.stringify({ ...data, photoURL: downloadURL })
          );
          setShowModal(false);
        });
      });
    }
  };

  //  croper information end
  const [showModal, setShowModal] = useState(false);

  const data = useSelector((state) => state.userLogInfo.userInfo);

  const handaleLogOut = () => {
    signOut(auth)
      .then(() => {
        Navigate("/Login");
        dispatch(userLogInfo(null));
        localStorage.removeItem("user");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handaleCancel = () => {
    setShowModal(false);
  };
  return (
    <div>
      <nav>
        <div className="main_menu">
          <div className="container mx-auto flex justify-between items-cente text-center">
            <div className="profile">
              <div className="img relative group">
                <img
                  className="  rounded-full overflow-hidden  w-full"
                  src={data.photoURL}
                  alt="photo"
                />
                {/* <h1 className=" group-hover:opacity-0 ">{data?.displayName[0]}</h1> */}
                <div
                  onClick={() => setShowModal(true)}
                  className="overlay hidden group-hover:block"
                >
                  <MdOutlineCloudDownload />
                </div>
              </div>
              <div className="text">
                <h2> {data?.displayName} </h2>
              </div>
            </div>
            <div className="icon">
              <Link to="/home">
                <AiTwotoneHome />
              </Link>
              <Link to="/chat">
                <RiMessage3Fill />
              </Link>
              <Link to="/home">
                <IoNotificationsSharp />
              </Link>
              <div onClick={handaleLogOut} className=" text-red-600 ">
                <RiLogoutCircleLine />
              </div>
            </div>
          </div>
        </div>
        {/* modal start */}
        {showModal && (
          <div className="modal">
            <div className="box">
              <h2> update your profile picture</h2>
              <input onChange={handaleProfile} type="file" />
              <div className="crop">
                <div className="img-preview w-full h-full" />
              </div>

              {image && (
                <Cropper
                  ref={cropperRef}
                  style={{ height: 400, width: "100%" }}
                  zoomTo={0.5}
                  initialAspectRatio={1}
                  preview=".img-preview"
                  src={image}
                  viewMode={1}
                  minCropBoxHeight={10}
                  minCropBoxWidth={10}
                  background={false}
                  responsive={true}
                  autoCropArea={1}
                  checkOrientation={false}
                  guides={true}
                />
              )}

              <div className="btn flex gap-3 mt-3 justify-center items-center">
                <button onClick={getCropData} className="Button_v_1">
                  update
                </button>
                <button onClick={handaleCancel} className="Button_v_1">
                  cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* modal end */}
      </nav>
    </div>
  );
};

export default Navbar;
