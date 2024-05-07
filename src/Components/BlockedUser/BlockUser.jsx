import { getDatabase, onValue, push, ref, remove, set } from "firebase/database";
import { useEffect, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useSelector } from "react-redux";
import ProfilePicture from "../ProfilePicture/ProfilePicture";



const BlockUser = () => {

    const db = getDatabase()
    const data = useSelector((state) => state.userLogInfo.userInfo)
    let[blockList , setBlockList]=useState([])

    useEffect(()=>{
       const blockRf=ref(db,'block')
       onValue(blockRf,(snapshot)=>{
        let list =[]
        snapshot.forEach((item)=>{
            if(data.uid == item.val().blockById){
               list.push({
                id : item.key,
                block : item.val().block,
                blockId : item.val().blockId
               })
                  
            }
            else{
              list.push({
                id:item.key,
                blockBy : item.val().blockBy,
                blockById : item.val().blockById
              })
            }
        })
        setBlockList(list)
       })
    },[])


    // handle unblock start
    
    const handleUnblock =(item)=>{
        set(push(ref(db,'friends')),{
            senderId : item.blockId,
            senderName :item.block,
            receverId : data.uid,
            receverName : data.displayName, 
              
        }).then(()=>{
            remove(ref(db,"block/"+item.id))
        })
    
      }
    

    // handle unblock end 


    return (
        <div className="all">
            <div className="main ">
                <div className="text">
                    <h2>BlockUser</h2>
                </div>
                <div className="img">
                    <BsThreeDotsVertical />
                </div>
            </div>


            {
               blockList.map((item,i)=>{
                
                return(
                    <div key={i} className="main_group">
                    <div className="group">
                        <div className="profile">
                            <ProfilePicture imgId={item.blockById? item.blockById:item.blockId}/>
                        </div>
                        <div className="text">
                           
                            <h2> {item.block ? item.block : item.blockBy} </h2>
                        </div>
                    </div>
                    <div className="btn">
                        {
                            item.blockById?
                            <button className="Button_v_4"> I blocked you </button>
                            :
                            <button onClick={()=>handleUnblock(item)} className="Button_v_2">Unblock</button>


                        }
                    </div>
                </div>

                )
               }) 
            }
          
           
           
           
           
        </div>
    );
};

export default BlockUser;