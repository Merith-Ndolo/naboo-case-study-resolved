import { PageTitle } from "@/components";
import {
  GetActivityQuery
} from "@/graphql/generated/types";
import GetActivity from "@/graphql/queries/activity/getActivity";
import { useQuery } from "@apollo/client";
import { Badge, Flex, Grid, Group, Image, Text } from "@mantine/core";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";



export default function ActivityDetails() {
  const router = useRouter();
  const { data, loading } = useQuery<GetActivityQuery>(
    GetActivity,
    {
      variables: { id: router.query.id as string },
    }
  );

  const activity = data?.getActivity;


  return (
    <>
    {loading || !activity ? (
      <div>Loading activity...</div>
    ):(
      <>
      <Head>
        <title>{activity.name} | CDTR</title>
      </Head>
      <PageTitle title={activity.name} prevPath={router.back} />
      <Grid>
        <Grid.Col span={7}>
          <Image
            src="https://source.unsplash.com/random/?city"
            radius="md"
            alt="random image of city"
            width="100%"
            height="400"
          />
        </Grid.Col>
        <Grid.Col span={5}>
          <Flex direction="column" gap="md">
            <Group mt="md" mb="xs">
              <Badge color="pink" variant="light">
                {activity.city}
              </Badge>
              <Badge color="yellow" variant="light">
                {`${activity.price}€/j`}
              </Badge>
              <Badge color='indigo' variant="light">
                {`${activity.addedByUsersAsFavorites?.length}`}
              </Badge>
            </Group>
            <Text size="sm">{activity.description}</Text>
            <Text size="sm" color="dimmed">
              Ajouté par {activity.owner.firstName} {activity.owner.lastName}
            </Text>
          </Flex>
        </Grid.Col>
      </Grid>
      </>  
    )}
      
    </>
  );
}
