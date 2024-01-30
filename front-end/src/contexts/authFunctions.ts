//TODO: authFunctions define outside the authContext
import { useSnackbar } from "@/hooks";
import { useLazyQuery, useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import GetUser from "@/graphql/queries/auth/getUser";
import Signin from "@/graphql/mutations/auth/signin";
import Signup from "@/graphql/mutations/auth/signup";
import Logout from "@/graphql/mutations/auth/logout";
import { 
    GetUserQuery, 
    GetUserQueryVariables, 
    LogoutMutation, 
    LogoutMutationVariables, 
    SignInInput, 
    SignUpInput, 
    SigninMutation, 
    SigninMutationVariables, 
    SignupMutation, 
    SignupMutationVariables 
} from "@/graphql/generated/types";

export const useAuthFunctions = () => {
  const snackbar = useSnackbar();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<GetUserQuery["getMe"] | null>(null);
  const router = useRouter();

  const [getUser] = useLazyQuery<GetUserQuery, GetUserQueryVariables>(GetUser);
  const [signin] = useMutation<SigninMutation, SigninMutationVariables>(Signin);
  const [signup] = useMutation<SignupMutation, SignupMutationVariables>(Signup);
  const [logout] = useMutation<LogoutMutation, LogoutMutationVariables>(Logout);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!user && token) {
      getUser()
        .then((res) => setUser(res.data?.getMe || null))
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const handleSignin = async (input: SignInInput) => {
    try {
      setIsLoading(true);
      const response = await signin({ variables: { signInInput: input } });
      const token = response.data?.login?.access_token || "";
      localStorage.setItem("token", token);
      await getUser().then((res) => setUser(res.data?.getMe || null));
      router.push("/profil");
    } catch (err) {
      snackbar.error("Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (input: SignUpInput) => {
    try {
      setIsLoading(true);
      await signup({ variables: { signUpInput: input } });
      router.push("/signin");
    } catch (err) {
      snackbar.error("Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await logout();
      localStorage.removeItem("token");
      setUser(null);
      router.push("/");
    } catch (err) {
      snackbar.error("Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    isLoading,
    handleSignin,
    handleSignup,
    handleLogout,
  };
};
