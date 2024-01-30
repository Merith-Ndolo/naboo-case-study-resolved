import { useAuth } from "@/hooks";
import { Burger, Container, Group, Header, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";
import { MenuItem } from "./MenuItem";
import { useTopBarStyles } from "./Topbar.styles";
import { getFilteredRoutes } from "./getFilteredRoutes";
import { Route } from "./types";

interface TopbarProps {
  routes: Route[];
}

export function Topbar({ routes }: TopbarProps) {
  const [opened, { toggle }] = useDisclosure(false);
  const { classes } = useTopBarStyles();
  const { user } = useAuth();
  const filteredRoutes = getFilteredRoutes(routes, user);

  return (
    <Header height={56} className={classes.header}>
      <Container>
        <div className={classes.inner}>
          <Link href="/" className={classes.mainLink}>
            <Group mt="md" mb="xs">
              <h1 className={classes.title}>Candidator</h1>
              {user?.role === 'ADMIN' && <Text size="sm" color="grape"> Debug mode</Text>}
            </Group>
          </Link>
          <Group spacing={5} className={classes.links}>
            {filteredRoutes.map((route) => (
              <MenuItem key={route.label} {...route} />
            ))}
          </Group>
          <Burger
            opened={opened}
            onClick={toggle}
            className={classes.burger}
            size="sm"
            color="#fff"
          />
        </div>
      </Container>
    </Header>
  );
}
