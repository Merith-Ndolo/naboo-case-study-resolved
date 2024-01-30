import { Activity, EmptyData, PageTitle } from "@/components";
import {ActivityDto} from "@/graphql/generated/types";
import GetUserFavoritesActivities from "@/graphql/queries/activity/getUserFavoritesActivities";
import { withAuth } from "@/hocs";
import { useQuery } from "@apollo/client";
import { Grid, Group } from "@mantine/core";
import Head from "next/head";
import { useEffect } from "react";

const MyFavorites = () => {
  const { data, loading: loadingFavorites, refetch: refreshFavorites  } = useQuery(GetUserFavoritesActivities);

  useEffect(() => {
    refreshFavorites();
  }, []);

  const favorites = data?.getUserFavoritesActivities;

  return (
    <>
      <Head>
        <title>Mes favoris | CDTR</title>
      </Head>
      <Group position="apart">
        <PageTitle title="Mes favoris" />
      </Group>
      {loadingFavorites ? (
        <div>Loading favorites activities...</div>
      ): (
         <Grid>
        {favorites?.length > 0 ? (
          favorites.map((activity: ActivityDto) => (
            <Activity activity={activity} key={activity.id} refresh={refreshFavorites} />
          ))
        ) : (
          <EmptyData />
        )}
      </Grid>
      )}
     
    </>
  );
};

export default withAuth(MyFavorites);
