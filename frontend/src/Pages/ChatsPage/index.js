import React, { useEffect, useState } from "react";
import axios from "axios";

const ChatsPage = () => {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    getChats();
  }, []);

  const getChats = async () => {
    const data = await axios.get("http://localhost:8000/chats");
    setChats(data.data);
  };

  return (
    <div>
      Chats
      {chats.map((chat) => (
        <div key={chat._id}>{chat.chatName}</div>
      ))}
    </div>
  );
};

export default ChatsPage;
