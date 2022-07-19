import React from "react";
import {
  Box,
  Container,
  Text,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import Login from "../../PageComponents/HomePage/Login";
import SignUp from "../../PageComponents/HomePage/SignUp";

const HomePage = () => {
  return (
    <Container maxW="xl" centerContent>
      <Box
        display={"flex"}
        justifyContent={"center"}
        padding={3}
        bg={"white"}
        width="100%"
        margin={"40px 0 15px 0"}
        borderRadius={"lg"}
        borderWidth="1px"
      >
        <Text fontFamily={"Work Sans"} fontSize="4xl">
          Talk-a-tive
        </Text>
      </Box>
      <Box w={"100%"} bg="white" p={4} borderRadius="lg" borderWidth={"1px"}>
        <Tabs variant="soft-rounded" colorScheme={"blackAlpha"}>
          <TabList mb={"1em"}>
            <Tab width={"50%"}>Login</Tab>
            <Tab width={"50%"}>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <SignUp />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default HomePage;
