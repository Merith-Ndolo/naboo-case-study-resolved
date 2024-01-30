import { PageTitle } from "@/components";
import { withAuth } from "@/hocs";
import { useAuth } from "@/hooks";
import { Avatar, Flex, Text } from "@mantine/core";
import { NextPage } from "next";
import Head from "next/head";

const Profile: NextPage = () => {
  const { user } = useAuth();
  return (
    <>
      <Head>
        <title>Mon profil | CDTR</title>
      </Head>
      <PageTitle title="Mon profil" />
      <Flex align="center" gap="md">
        <Avatar color="cyan" radius="xl" size="lg">
          {user?.firstName[0]}
          {user?.lastName[0]}
        </Avatar>
        <Flex direction="column">
          <Text>Email: {user?.email}</Text>
          <Text>First name: {user?.firstName}</Text>
          <Text>Last name: {user?.lastName}</Text>
          <Text>Role: {user?.role}</Text>
        </Flex>
      </Flex>
    </>
  );
};

export default withAuth(Profile);
