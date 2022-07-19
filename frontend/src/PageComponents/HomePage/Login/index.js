import React, { useState } from "react";
import { VStack } from "@chakra-ui/layout";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { useToast } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import axios from "axios";
import { useHistory } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    password: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const history = useHistory();

  const [passwordShow, setPasswordShow] = useState(false);

  const handleChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;

    setFormData((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const changePasswordVisibility = (event) => {
    event.preventDefault();
    setPasswordShow((prev) => !prev);
  };

  const handleSignUp = async (event) => {
    event.preventDefault();
    setLoading(true);
    if (!formData.email || !formData.password) {
      toast({
        title: "Invalid Data",
        description: "Please enter all mandatory fields",
        duration: 2500,
        status: "error",
        position: "bottom",
        isClosable: true,
      });
      return;
    }

    try {
      const config = {
        headers: { "Content-type": "application/json" },
      };

      const { data } = await axios.post(
        "http://localhost:8000/api/user/login",
        {
          email: formData.email,
          password: formData.password,
        },
        config
      );

      localStorage.setItem("chat-app-token", data.data.token);

      toast({
        title: "Login Successful",
        description: "You have successfully logged on to our Chat App",
        duration: 2500,
        status: "success",
        position: "bottom",
        isClosable: true,
      });
      setLoading(false);
      history.push("/chats");
    } catch (error) {
      toast({
        title: error.message,
        duration: 2500,
        status: "error",
        position: "bottom",
        isClosable: true,
      });
      setLoading(false);
    }
  };

  return (
    <div>
      <VStack spacing={"5px"}>
        <FormControl isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            value={formData.email}
            name="email"
            placeholder="Enter Your E-mail Address"
            onChange={handleChange}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input
              value={formData.password}
              type={passwordShow ? "text" : "password"}
              name="password"
              placeholder="Enter Your Password"
              onChange={handleChange}
            />
            <InputRightElement width={"4.5rem"}>
              <Button
                onClick={changePasswordVisibility}
                h="1.75rem"
                size={"sm"}
              >
                {passwordShow ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <Button
          color={"blackAlpha"}
          width="100%"
          marginTop={"15px"}
          onClick={handleSignUp}
          isLoading={loading}
        >
          Login
        </Button>
      </VStack>
    </div>
  );
};

export default Login;
