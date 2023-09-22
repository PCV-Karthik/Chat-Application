import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@chakra-ui/toast";
import { ChatState } from "../../Context/ChatProvider";
import axios from "axios";
import { Button, Input, Stack, Tooltip } from "@chakra-ui/react";
import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import {Box, Spinner,Avatar,useDisclosure } from "@chakra-ui/react";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";
import {
  BellIcon,
  SearchIcon,
} from "@chakra-ui/icons";
import { BsSun,BsMoonFill } from "react-icons/bs";
import ProfileModal from "./ProfileModal";
import UserListItem from "../useAvatar/UserListItem";
import ChatLoading from "../ChatLoading";
import { getSender } from "../../config/ChatLogics";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  const {
    setSelectedChat,
    user,
    notification,
    setNotification,
    chats,
    setChats,
    theme,
    setTheme
  } = ChatState();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };


  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`/api/chat`, { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  return (
    <>
      <Stack
        justifyContent="center"
        bg={theme ? "white" : "#36404a"}
        p="5px 10px 5px 10px"
        h="100vh"
        gap="20px"
      >
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <SearchIcon boxSize={5} color={theme ? "black" : "#a6b0cf"} />
          </Button>
        </Tooltip>
        <Menu>
          <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
            <Button variant="ghost">
              <MenuButton>
                <BellIcon boxSize={7} color={theme ? "black" : "#a6b0cf"} />
              </MenuButton>
            </Button>
          </Tooltip>
          <MenuList>
            {!notification.length && "No New Messages"}
            {notification.map((notif) => (
              <MenuItem
                key={notif._id}
                onClick={() => {
                  setSelectedChat(notif.chat);
                  setNotification(notification.filter((n) => n !== notif));
                }}
              >
                {notif.chat.isGroupChat
                  ? `New Message in ${notif.chat.chatName}`
                  : `New Message from ${getSender(user, notif.chat.users)}`}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
        <Tooltip label={theme ? "Dark Mode" : "Lignt Mode"} hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={()=>setTheme((prev) => !prev)}>
            {theme ? <BsMoonFill size="20px"/> :<BsSun size="20px" color="#a6b0cf" />}
          </Button>
        </Tooltip>
        <Menu>
          <MenuButton>
            <Avatar
              size="sm"
              cursor={"pointer"}
              name={user.name}
              src={user.pic}
            />
          </MenuButton>
          <MenuList>
            <ProfileModal user={user}>
              <MenuItem>My Profile</MenuItem>
            </ProfileModal>
            <MenuItem onClick={logoutHandler}>Logout</MenuItem>
          </MenuList>
        </Menu>
        {/* </Box> */}
      </Stack>

      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Search User</DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" display="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
