import React, { useState, useEffect } from "react"
import { onAuthLoad, logout } from "../utils/AuthFunctions"
import { getUser, updateUser } from "../models/User"
import { getOrganization } from "../models/Organisation"
import { Link } from "gatsby"
import { navigate } from "gatsby-link"

import {
  Box,
  Image,
  Circle,
  Divider,
  HStack,
  Spacer,
  useDisclosure,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  AvatarBadge,
  Avatar,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react"

import {
  RiArrowDropDownLine,
  RiArrowLeftRightLine,
  RiLogoutBoxLine,
} from "react-icons/ri"

import Logo from "../images/RippleDEXWhite.svg"
import ProfilePicture from "../images/RippleDEXWhite.svg"

import ProfileSettings from "./settings/profileSettings"

const HeaderUser = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [user, setUser] = useState(null)
  const [org, setOrg] = useState(null)
  const [tab, setTab] = useState(0)

  useEffect(() => {
    onAuthLoad(
      async loggedUser => {
        const user = await getUser(loggedUser.uid)
        setUser(user)
        if (user.lastOpenedOrganization) {
          const org = await getOrganization(user.lastOpenedOrganization)
          setOrg(org)
        } 
      },
      () => navigate("/")
    )
  }, [])

  const clickHandler = () => {
    logout()
    navigate("/")
  }

  const handleOpen = val => {
    setTab(val)
    onOpen()
  }

  return (
    <Box zIndex={999} position="fixed" w="100vw" h="60px" bgColor="ripple.200">
      <HStack h="100%" textAlign="center" mr="20px">
        <a href="/dashboard">
          <Box pt="7px">
            <Image
              top="20px"
              left="21px"
              zIndex={999}
              pos="absolute"
              w="80px"
              src={Logo}
            />
            <Circle
              left="20px"
              top="-5px"
              pos="absolute"
              bgColor="ripple.200"
              size="80px"
            ></Circle>
          </Box>
        </a>
        <Box pl="170px">
          {org?.name  &&
            <Popover >
              <PopoverTrigger>
                <Button
                  w="fit"
                  h="50px"
                  color="white"
                  bgColor="ripple.200"
                  fontFamily="Raleway-Bold"
                  fontSize="30px"
                  _hover={{ transform: "scale(1.01)" }}
                  _active={{ bg: "ripple.200", transform: "scale(1.01)" }}
                >
                  {org?.name  || "loading..."}
                  {<RiArrowDropDownLine size="50px" />}
                </Button>
              </PopoverTrigger>
              <PopoverContent w="350px">
                <PopoverBody>
                  <VStack spacing={5} align="start" p="8px">
                    <HStack p="15px" spacing={5}>
                      <Avatar size="md" src={Logo} />
                      <Box textAlign="left" ml>  
                        <Heading as="h3" size="md">
                          {org?.name || "loading..."}
                        </Heading>
                        <Text color="gray">Id: {user?.lastOpenedOrganization || "loading..."}</Text>
                      </Box>
                    </HStack>

                    <Divider />
                    <Button
                      bgColor="white"
                      _hover={{
                        transform: "scale(1.08)",
                      }}
                    >
                      <Link to="/Invite"> Invite people to {org?.name || "loading..."}</Link>
                    </Button>
                    {org.admin === user.id &&  <Button
                      bgColor="white"
                      _hover={{
                        transform: "scale(1.08)",
                      }}
                      onClick={() => {
                        handleOpen(3)
                      }}
                    >
                      Settings & Administration
                    </Button>}
                    <Divider />
                    <Button
                      bgColor="white"
                      _hover={{
                        transform: "scale(1.08)",
                      }}
                      leftIcon={<RiArrowLeftRightLine />}
                    >
                      Switch Workspace
                    </Button>
                  </VStack>
                </PopoverBody>
              </PopoverContent>
            </Popover>
          }
          {!user?.lastOpenedOrganization && 
             <Text
               w="fit"
               h="50px"
               color="white"
               bgColor="ripple.200"
               fontFamily="Raleway-Bold"
               fontSize="30px"
             > No Workspace
             </Text>
          }
        </Box>
        <Spacer />
        {/* Header Profile Right Side */}
        <Box pr="15px">
          <ProfileSettings 
            isOpen={isOpen} 
            onClose={onClose} 
            tab={tab} 
            user={user} 
            setUser={setUser}
            org={org}
            setOrg={setOrg}
          />
          <Popover>
            <PopoverTrigger>
              <Avatar
                size="md"
                name={user?.firstName + " " + user?.lastName || "loading..."}
                src={user?.profilePicture || ProfilePicture}
                _hover={{
                  transform: "scale(1.01)",
                }}
              >
                <AvatarBadge
                  boxSize="20px"
                  bg={user?.isInvisible ? "gray.300" : "green.300"}
                  borderColor="ripple.200"
                />
                {/* bg is online or offline, change based on boolean later */}
              </Avatar>
            </PopoverTrigger>
            <PopoverContent w="350px">
              <PopoverBody>
                <VStack spacing={5} align="start" p="8px">
                  <HStack p="15px" spacing={5}>
                    <Avatar
                      size="md"
                      name={user?.firstName + " " + user?.lastName?.lastName || "loading..."}
                      src={user?.profilePicture || ProfilePicture}
                      _hover={{
                        transform: "scale(1.01)",
                      }}
                    >
                      <AvatarBadge
                        boxSize="20px"
                        borderColor="black"
                        bg={user?.isInvisible ? "gray.300" : "green.300"}
                      />
                      {/* bg is online or offline, change based on boolean later */}
                    </Avatar>
                    <Box textAlign="left" ml>
                      <Heading as="h3" size="md">
                        {user?.firstName + " " + user?.lastName || "loading..."}
                      </Heading>
                      <Text color="gray">{user?.email || "loading..."}</Text>
                    </Box>
                  </HStack>

                  <Divider />
                  <Button
                    bgColor="white"
                    _hover={{ transform: "scale(1.08)" }}
                    onClick={() => {
                      updateUser(
                        user?.id, 
                        {isInvisible: !user?.isInvisible}
                      ).then((updatedUser) => setUser(updatedUser))
                    }}
                  >
                    Set as {user?.isInvisible ? "Visible" : "Invisible"}
                  </Button>
                  {/* should be a button*/}
                  <Button
                    bgColor="white"
                    _hover={{ transform: "scale(1.08)" }}
                    onClick={() => {
                      handleOpen(1)
                    }}
                  >
                    Notifications
                  </Button>
                  <Divider />
                  <Button
                    bgColor="white"
                    _hover={{ transform: "scale(1.08)" }}
                    onClick={() => {
                      handleOpen(0)
                    }}
                  >
                    Edit Profile
                  </Button>
                  <Button
                    bgColor="white"
                    _hover={{ transform: "scale(1.08)" }}
                    onClick={() => {
                      handleOpen(0)
                    }}
                  >
                    View Profile
                  </Button>
                  <Divider />
                  <Button
                    color="red"
                    bgColor="white"
                    onClick={clickHandler}
                    _hover={{ transform: "scale(1.08)" }}
                    leftIcon={<RiLogoutBoxLine />}
                  >
                    Sign out of RippleDEX
                  </Button>
                </VStack>
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </Box>
      </HStack>
    </Box>
  )
}

export default HeaderUser
