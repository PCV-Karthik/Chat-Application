import React from "react";
// import { ChatState } from '../../Context/ChatProvider';
import { Avatar, Stack, Box, Text } from "@chakra-ui/react";
import { color } from "framer-motion";

const UserListItem = ({ user, handleFunction }) => {
  return (
    <Box
      display="flex"
      onClick={handleFunction}
      cursor="pointer"
      alignItems="center"
      _hover={{
        background: "blue",
        color: "white",
      }}
      paddingX={3}
      paddingY={2}
      marginBottom={2}
      borderRadius="lg"
      w="100%"
    >
      <Avatar src={user.pic} />
      <Stack gap="2px" marginLeft="10px" marginTop="3px" marginBottom="0px">
        <Text fontSize="sm" marginBottom={0}>{user.name}</Text>
        <Text fontSize="xs" marginBottom={0}>
          <b>Email:</b> {user.email}
        </Text>
      </Stack>
    </Box>
  );
};

export default UserListItem;
