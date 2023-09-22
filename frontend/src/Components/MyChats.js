import { AddIcon } from "@chakra-ui/icons";
import { Box, Stack, Text } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useEffect, useState } from "react";
import { getSender } from "../config/ChatLogics";
import ChatLoading from "./ChatLoading";
import GroupChatModal from "./miscellaneous/GroupChatModal";
import { Avatar, Button, theme } from "@chakra-ui/react";
import { ChatState } from "../Context/ChatProvider";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();

  const { selectedChat, setSelectedChat, user, chats, setChats,theme } = ChatState();

  const toast = useToast();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain,chats]);

  let d = new Date();
  d = d.toISOString();

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      w={{ base: "100%", md: "32%" }}
      borderStyle={"none"}
    >
      <Box
        py={3}
        px={7}
        fontSize={{ base: "28px", md: "30px" }}
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
        bg= {theme ? "#f4f7fb" : "#303841"}
        color={theme ? "black" : "white"}
      >
        Chats
        <GroupChatModal>
          <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display="flex"
        flexDir="column"
        bg= {theme ? "#f4f7fb" : "#303841"}
        w="100%"
        h="100%"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll" gap={0}>
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={theme ? (selectedChat === chat ? "#e6ebf5" : "(230,235,245,0.5)") : 
                (selectedChat === chat ? "#36404a" : "#303841")}
                color= "black"
                px={3}
                py={3}
                key={chat._id}
                display="flex"
              >
                <Avatar src={user.pic} />
                <Box display="flex" justifyContent="space-between" width="100%" alignItems="center">
                <Stack mx={2} gap={0} my={1}>
                  <Text m={0} fontSize="md" fontWeight="semibold" color={theme ? "black" : "white"}>
                    {!chat.isGroupChat
                      ? getSender(loggedUser, chat.users)
                      : chat.chatName}
                  </Text>
                  {chat.latestMessage && (
                    <Text fontSize="xs" m={0} color={theme ? "black" : "white"}>
                      {chat.isGroupChat
                      ? <b>{chat.latestMessage.sender.name} :</b>
                      : ""}
                      {chat.latestMessage.content.length > 50
                        ? chat.latestMessage.content.substring(0, 51) + "..."
                        : chat.latestMessage.content}
                    </Text>
                  )}
                  
                </Stack>
                  <Text m={0} fontSize="12px" color={theme ? "black" : "white"}>{
                  chat.latestMessage ? (
                    (chat.latestMessage.createdAt).split('T')[0] == d.split('T')[0] ? 
                    (parseInt(chat.latestMessage.createdAt.split('T')[1].split(':')[0]) > 12 ?
                    (parseInt(chat.latestMessage.createdAt.split('T')[1].split(':')[0]) - 12).toString() + ":" + chat.latestMessage.createdAt.split('T')[1].slice(3,5) + " PM" : 
                    parseInt(chat.latestMessage.createdAt.split('T')[1].slice(0,2)).toString() + ":" +
                    chat.latestMessage.createdAt.split('T')[1].slice(3,5) + " AM"
                    ): 

                    (chat.latestMessage.createdAt.split('T')[0])) : ""}
                  </Text>
                </Box>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
