




import { useEffect, useState } from "react";
import { getDatabase, onValue, push, ref, set } from "firebase/database";
import { useSelector } from "react-redux";


const MsgGroup = () => {
    const db = getDatabase()
    const data = useSelector((state) => state.userLogInfo.userInfo)
    const [groupList, setGroupList] = useState([])

    // group list start
    useEffect(() => {
        const groupRf = ref(db, 'group')
        onValue(groupRf, (snapshot) => {
            let list = []
            snapshot.forEach((item) => {
                list.push({ ...item.val(), id: item.key })
            })
            setGroupList(list)
        })

    }, [])


    // grouplist end



    return (
        <div className="all">
            <div className="main ">
                <div className="text">
                    <h2>GroupList</h2>
                </div>

            </div>

            <div>
                {
                    groupList.map((item, i) => {
                        return (
                            <div key={i} className="main_group">
                                <div className="group">
                                    <div className="profile"></div>
                                    <div className="text">
                                        <h2 className=" text-sm font-bold text-red-500 "> admin: {item.adminName} </h2>
                                        <h1 className="text-lg font-serif text-teal-600 "> {item.groupName} </h1>
                                        <h2> {item.groupIntroName} </h2>
                                    </div>
                                </div>
                                <div className="btn">
                                    <button className="Button_v_2">message</button>
                                </div>

                            </div>
                        )

                    })
                }
            </div>


        </div>
    );
};

export default MsgGroup;