import Friend from "../../Components/Friends/Friend";
import MsgGroup from "../../Components/GroupList/MsgGroup";
import Navbar from "../../Components/Navbar/Navbar";
import Chating from "../../Components/chating/Chating";


const Chat = () => {
    return (
        <div>
            <Navbar />
            <div className="container mx-auto ">
                <div className="flex justify-between mt-4">
                    <div className=" w-[35%]">
                        <div className="  border border-red-600 p-3 rounded-lg mb-3 overflow-y-scroll">
                            <Friend></Friend>
                        </div>

                        <div className="  border border-red-600 p-4 rounded-lg overflow-y-scroll">
                            <MsgGroup></MsgGroup>
                        </div>

                    </div>
                    <div className="w-[60%]">
                        <Chating></Chating>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chat;