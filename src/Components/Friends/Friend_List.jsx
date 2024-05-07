import { BsThreeDotsVertical } from "react-icons/bs";
import { getDatabase, onValue, push, ref, remove, set } from "firebase/database";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import ProfilePicture from "../ProfilePicture/ProfilePicture";


const Friend_List = () => {

    const db = getDatabase()
    const data = useSelector((state) => state.userLogInfo.userInfo)
    let [friend , setFriend]=useState([])
    
      

    useEffect(()=>{
        const friendRf = ref(db,'friends')
        onValue(friendRf,(snapshot)=>{
            let list = []
            snapshot.forEach((item)=>{
                if(data.uid==item.val().receverId || data.uid==item.val().senderId){
                    list.push({...item.val(), id:item.key})
                }
            

            })
            setFriend(list)

        })
    },[])
    
    
    // handleBlock start
    const handleBlock =(item)=>{
        if(data.uid==item.senderId){
            set(push(ref(db, 'block')),{
                block:item.receverName,
                blockId:item.receverId,
                blockBy:item.senderName,
                blockById:item.senderId
            }).then(()=>{
                remove(ref(db,'friends/'+item.id))
            })
        }
        else{
            set(push(ref(db,'block')),{
                block:item.senderName,
                blockId:item.senderId,
                blockBy:item.receverName,
                blockById:item.receverId
                
            }).then(()=>{
                remove(ref(db,'friends/'+item.id))
            })
        }

    }
    // handleBlock end



    return (
        <div className="all">
            <div className="main ">
                <div className="text">
                    <h2>Friend_List</h2>
                </div>
                <div className="img">
                    <BsThreeDotsVertical />
                </div>
            </div>
           {
            friend.map((item,i)=>{
                return(
                    <div key={i} className="main_group">
                    <div className="group">
                        <div className="profile">
                        <ProfilePicture imgId={data.uid==item.senderId? item.receverId : item.senderId} />
                        </div>
                        <div className="text">
                           {
                            data.uid==item.senderId?
                            <h1> {item.receverName} </h1>
                            :
                            <h1> {item.senderName} </h1>
                            
                           }
                           
                        </div>
                    </div>
                    <div className="btn flex gap-3">
                        <button className="Button_v_2">unfriend</button>
                        <button onClick={()=>handleBlock(item)} className="Button_v_4">block</button>
                        
                    </div>
                </div>
                )
            })
           }
           
            
           
            
        </div>
    );
};

export default Friend_List;