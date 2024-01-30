import { useAuth } from "@/hooks";
import { Box, Loader } from "@mantine/core";
import { useRouter } from "next/router";
import { ComponentType, useEffect } from "react";

export function withoutAuth(WrappedComponent: ComponentType<any>) {
  //TODO: Best to create a function but to resolve the issue than use // eslint-disable-next-line react/display-name
  const WithAuthComponent = (props: any) => {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isLoading && user) {
        router.push("/");
      }
    }, [isLoading, router, user]);

    if (isLoading)
      return (
        <Box sx={{ textAlign: "center" }}>
          <Loader sx={{ marginTop: "10rem" }} />
        </Box>
      );

    return !isLoading && !user && <WrappedComponent {...props} />;
  };

  return WithAuthComponent;
}
