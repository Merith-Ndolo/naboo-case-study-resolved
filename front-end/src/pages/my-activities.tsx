import { Activity, EmptyData, PageTitle } from "@/components";
import { ActivityDto } from "@/graphql/generated/types";
import GetUserActivities from "@/graphql/queries/activity/getUserActivities";
import { withAuth } from "@/hocs";
import { useAuth } from "@/hooks";
import { useQuery } from "@apollo/client";
import { Button, Grid, Group } from "@mantine/core";
import Head from "next/head";
import Link from "next/link";


const MyActivities = () => {
  const { user } = useAuth();
  const { data, loading: loadingMyActivities, refetch: refreshMyActivities } = useQuery(GetUserActivities);

  const myActivities = data?.getActivitiesByUser;

  return (
    <>
      <Head>
        <title>Mes activités | CDTR</title>
      </Head>
      <Group position="apart">
        <PageTitle title="Mes activités" />
        {user && (
          <Link href="/activities/create">
            <Button>Ajouter une activité</Button>
          </Link>
        )}
      </Group>
      {loadingMyActivities ? (
        <div>Loading my activities...</div>
      ): (
         <Grid>
        {myActivities?.length > 0 ? (
          myActivities.map((activity: ActivityDto) => (
            <Activity activity={activity} key={activity.id} refresh={refreshMyActivities} />
          ))
        ) : (
          <EmptyData />
        )}
      </Grid>
      )}
     
    </>
  );
};

export default withAuth(MyActivities);
