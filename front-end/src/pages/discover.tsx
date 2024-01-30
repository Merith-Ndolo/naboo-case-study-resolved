import { Activity, EmptyData, PageTitle } from "@/components";
import {
  ActivityDto,
} from "@/graphql/generated/types";
import GetActivities from "@/graphql/queries/activity/getActivities";
import { useAuth } from "@/hooks";
import { useQuery } from "@apollo/client";
import { Button, Grid, Group } from "@mantine/core";
import Head from "next/head";
import Link from "next/link";



export default function Discover() {
  const { user } = useAuth();
  const { data, loading: activitiesLoading, refetch: refreshActivities } = useQuery(GetActivities);


  const activities = data?.getActivities;

  return (
    <>
      <Head>
        <title>Discover | CDTR</title>
      </Head>
      <Group position="apart">
        <PageTitle title="Découvrez des activités" />
        {user && (
          <Link href="/activities/create">
            <Button>Ajouter une activité</Button>
          </Link>
        )}
      </Group>
      {activitiesLoading ? (
        <div>Loading activities...</div>
      ):(
         <Grid>
        {activities?.length > 0 ? (
          activities.map((activity: ActivityDto) => (
            <Activity activity={activity} key={activity.id} refresh={refreshActivities}  />
          ))
        ) : (
          <EmptyData />
        )}
      </Grid>
      )}
     
    </>
  );
}
