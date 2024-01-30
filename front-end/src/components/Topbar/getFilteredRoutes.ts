import { GetUserQuery } from "@/graphql/generated/types";
import { Route, SubRoute } from "./types";

export const checkRouteAccess = (
  route: Route | SubRoute,
  user: GetUserQuery["getMe"] | null
): boolean => {
  //TODO:  more concise and readable
  if(!user) {
    return route.requiredAuth === undefined || route.requiredAuth === false
  } 
  return route.requiredAuth !== false
};

export const getFilteredRoutes = (
  routes: Route[],
  user: GetUserQuery["getMe"] | null
) => {
  return routes
    .map((route) => {
      if (Array.isArray(route.route)) {
        const filteredSubRoutes = route.route.filter((subRoute) =>
          checkRouteAccess(subRoute, user)
        );
        return { ...route, route: filteredSubRoutes };
      } else {
        return route;
      }
    })
    .filter((route) => checkRouteAccess(route, user));
};
