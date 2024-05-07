import { BsThreeDotsVertical } from "react-icons/bs";
import { getDatabase, onValue, push, ref, remove, set } from "firebase/database";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import ProfilePicture from "../ProfilePicture/ProfilePicture";


const FriendRequest = () => {

    const db = getDatabase()
    const data = useSelector((state) => state.userLogInfo.userInfo)
  
    const [friendList, setFriendList] = useState([])
 
    
            useEffect(()=>{
                const friendlistRef = ref(db,'frendRequest')
                onValue(friendlistRef,(snapshot)=>{
                    let list=[]
                    snapshot.forEach((item)=>{
                       if(item.val().receverId==data.uid){
                        list.push({...item.val(),id:item.key})

                       }
                    })
                    setFriendList(list)
                })
                

            },[])

    // friendRequest accept and delect start
    const handleAccept=(item)=>{
       set(push(ref(db,'friends')),{
        ...item
       })
       .then(()=>{
        remove(ref(db,'frendRequest/'+item.id))
       })
       
    }

    const handleDelete=(item)=>{
        remove(ref(db,'frendRequest/'+item.id))

    }


    // friendRequest accept and delect end

return (
    <div className="all">
        <div className="main ">
            <div className="text">
                <h2>FriendRequest</h2>
            </div>
            <div className="img">
                <BsThreeDotsVertical />
            </div>
        </div>

        <div>
        {
          friendList.map((item)=>{
            return(
                <div key={item.id} className="main_group">
                <div className="group">
                    <div className="profile">
                    <ProfilePicture imgId={item.senderId} />
                    </div>
                    <div className="text">
                        <h1> {item.senderName} </h1>
                       
                    </div>
                </div>
                <div className="btn flex gap-3">
                    <button onClick={()=>handleAccept(item)} className=" Button_v_2" >accept</button>
                    <button onClick={()=>handleDelete(item)} className=" Button_v_4" >delete</button>
                    
                </div>
                 </div>
            )
          }) 
        }
        </div>
      


    </div>
);
};

export default FriendRequest;