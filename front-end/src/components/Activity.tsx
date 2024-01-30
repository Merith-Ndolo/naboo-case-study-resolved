import { ActivityFragment } from "@/graphql/generated/types";
import { useAuth, useSnackbar } from "@/hooks";
import { formattedDateTime, useGlobalStyles } from "@/utils";
import { ApolloQueryResult, OperationVariables, useMutation } from "@apollo/client";
import { Badge, Box, Button, Card, Grid, Group, Image, Text } from "@mantine/core";
import Link from "next/link";
import { FC } from "react";
import { IconHeartFilled } from '@tabler/icons-react';
import ToggleFavoriteActivity from "@/graphql/mutations/activity/toggleFavoriteActivity";

interface FavoriteIconProps {
  isFavorite: boolean,
  onClick: () => void,
}


interface ActivityProps {
  activity: ActivityFragment;
  refresh: (variables?: Partial<OperationVariables> | undefined) => Promise<ApolloQueryResult<any>>
}

export function Activity({ activity, refresh }: ActivityProps) {
  const { classes } = useGlobalStyles();
  const { user } = useAuth()
  const snackbar = useSnackbar();

  const [toggleFavoriteActivity] = useMutation(ToggleFavoriteActivity);
 
  const handleToggleFavoriteActivity = async () => {
    try {
      await toggleFavoriteActivity({
        variables: {
          activityId: activity.id,
        },
      });
      refresh();
    } catch (err) {
      snackbar.error("Une erreur est survenue!");
    }
  };

  const isUserFavorite: boolean = !!user && !!activity?.addedByUsersAsFavorites?.includes(user.id);

  const FavoriteIcon: FC<FavoriteIconProps>  = ({ isFavorite, onClick }) => (
    <IconHeartFilled
      onClick={onClick}
      size={24}
      style={{ color: isFavorite ? 'red' : 'silver' }}
    />
  );


  return (
    <Grid.Col span={4}>
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Card.Section>
          <Image
            src="https://source.unsplash.com/random/?city"
            height={160}
            alt="random image of city"
          />
        </Card.Section>

        <Group position="apart" mt="md" mb="xs">
          {/**
           * TODO: add truncate for the title to avoid card the get to big size
           */}
          <Text w={200} weight={500} truncate="end" className={classes.ellipsis}>
            {activity.name}
          </Text>
          <Box style={{ display: 'flex', alignItems: 'center' }}>
            <Text size={10}>
              {activity?.addedByUsersAsFavorites?.length || 0}
            </Text>
            <FavoriteIcon
              isFavorite={isUserFavorite}
              onClick={handleToggleFavoriteActivity}
            />
          </Box>
        </Group>

        <Group mt="md" mb="xs">
          <Badge color="pink" variant="light">
            {activity.city}
          </Badge>
          <Badge color="yellow" variant="light">
            {`${activity.price}€/j`}
          </Badge>
        </Group>

        <Text size="sm" color="dimmed" className={classes.ellipsis}>
          {activity.description}
        </Text>
        {user?.role === 'ADMIN' && (
           <Text size="sm" color="dark" className={classes.ellipsis}>
          {`created on ${formattedDateTime(activity.createdAt)}`}
        </Text>
        )}
        <Link href={`/activities/${activity.id}`} className={classes.link}>
          <Button variant="light" color="blue" fullWidth mt="md" radius="md">
            Voir plus
          </Button>
        </Link>
      </Card>
    </Grid.Col>
  );
}
