import { useEffect, useState } from "react";
import { getDownloadURL, getStorage, ref } from "firebase/storage";





const ProfilePicture = ({imgId}) => {

    let [ProfilePicture, setProfilePicture] = useState('')
    // console.log(ProfilePicture)
    const storage = getStorage();
    const pictureRef = ref(storage, imgId)

    useEffect(() => {
        getDownloadURL(pictureRef)
            .then((url) => { setProfilePicture(url) })
            .catch((error) => { console.log(error) })
    })
    return (
        <div>

            <img className=" rounded-full " src={ProfilePicture} alt="" />
        </div>
    );
};

export default ProfilePicture;