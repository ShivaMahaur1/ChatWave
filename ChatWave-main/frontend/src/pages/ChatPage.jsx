import { useEffect, useState } from "react";
import { useParams } from "react-router";

import { useQuery } from "@tanstack/react-query";



import toast from "react-hot-toast";

import { getStreamToken } from "../lib/api";
import { Channel, ChannelHeader, Chat, MessageInput, MessageList, Thread, Window } from "stream-chat-react";
import { StreamChat } from "stream-chat";
import useAuthUser from "../hooks/useAuthUser";

import CallButton from "../component/CallButton";
import ChatLoader from "../component/ChatLoader";




const CHATWAVE_API_KEY = import.meta.env.VITE_CHATWAVE_API_KEY;

const ChatPage = () => {
  const { id: targetUserId } = useParams();

  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  const { authUser } = useAuthUser();

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser, // this will run only when authUser is available
  });

  useEffect(() => {
  let client;

  if (!tokenData?.token || !authUser) return;

  const initChat = async () => {
    try {
      client = StreamChat.getInstance(CHATWAVE_API_KEY);

      await client.connectUser(
        {
          id: authUser._id,
          name: authUser.fullName,
          image: authUser.profilePic,
        },
        tokenData.token
      );

      const channelId = [authUser._id, targetUserId].sort().join("-");
      const currChannel = client.channel("messaging", channelId, {
        members: [authUser._id, targetUserId],
      });

      await currChannel.watch();

      setChatClient(client);
      setChannel(currChannel);
      setLoading(false);
    } catch (error) {
      console.error("Error initializing chat:", error);
      toast.error("Could not connect to chat. Please try again.");
      setLoading(false);
    }
  };

  initChat();

  // Cleanup only on unmount
  return () => {
    if (client) {
      client.disconnectUser();
    }
  };
}, [tokenData, authUser, targetUserId]);

  const handleVideoCall = () => {
    if (channel) {
      const callUrl = `${window.location.origin}/call/${channel.id}`;

      channel.sendMessage({
        text: `I've started a video call. Join me here: ${callUrl}`,
      });

      toast.success("Video call link sent successfully!");
    }
  };

  if (loading || !chatClient || !channel) return <ChatLoader />;

  return (
    <div className="h-[93vh]">
      <Chat client={chatClient}>
        <Channel channel={channel}>
          <div className="w-full relative">
            <CallButton handleVideoCall={handleVideoCall} />
            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput focus />
            </Window>
          </div>
          <Thread />
        </Channel>
      </Chat>
    </div>
  );
};
export default ChatPage;