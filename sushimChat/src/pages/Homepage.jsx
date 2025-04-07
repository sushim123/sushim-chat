import { useChatStore } from "../store/useChatStore.js";
import Sidebar from "../components/Sidebar.jsx";
import NoChatSelected from "../components/NoChatSelected.jsx";
import ChatContainer from "../components/ChatContaineer.jsx";
const Homepage = () => {
  const { selectedUser} = useChatStore();
  return (
    <div className="h-screen bg-base-300 ">
      <div className="flex items-center justify-center pt-20 px-4  ">
        <div className=" rounded-lg shadow-xl w-full max-w-6xl h-[calc(100vh-8rem)] ">
          <div className="flex h-full rounded-lg overflow-hidden bg-gradient-to-r from-blue-400 through-red-300 to-green-500">
            <Sidebar />
            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Homepage;
