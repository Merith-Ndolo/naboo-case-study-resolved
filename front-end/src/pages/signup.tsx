import { PageTitle, SignupForm } from "@/components";
import { withoutAuth } from "@/hocs";
import { Paper } from "@mantine/core";
import { NextPage } from "next";
import Head from "next/head";

//TODO: page typing in a nextjs tsx file highly recommended to reduce runtime errors
const Signup: NextPage = () => {
  return (
    <>
      <Head>
        <title>Inscription | CDTR</title>
      </Head>
      <PageTitle title="Inscription" />
      <Paper shadow="xs" p="md">
        <SignupForm />
      </Paper>
    </>
  );
};
export default withoutAuth(Signup);
