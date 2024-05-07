import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Components/Navbar/Navbar";
import GroupList from "../../Components/GroupList/GroupList";
import UserList from "../../Components/UserList/UserList";
import Friend_List from "../../Components/Friends/Friend_List";
import FriendRequest from "../../Components/FriendsRequest/FriendRequest";
import MayGroup from "../../Components/MayGroup/MayGroup";
import BlockUser from "../../Components/BlockedUser/BlockUser";


const Home = () => {
    const data = useSelector((state) => state.userLogInfo.userInfo)
    const Navigate = useNavigate()
    useEffect(() => {
        if (!data) {
            Navigate('/Login')

        }
    })

    return (
        <div>
            <Navbar></Navbar>
            <div className="main_contant">
                <div className="item">
                    <GroupList />
                </div>
                <div className="item">
                    <Friend_List />
                </div>

                <div className="item">
                    <UserList />
                </div>
                <div className="item">
                    <FriendRequest />
                </div>

                <div className="item">
                    <MayGroup />
                </div>

                <div className="item">
                    <BlockUser />
                </div>
            </div>
        </div>
    );
};

export default Home;