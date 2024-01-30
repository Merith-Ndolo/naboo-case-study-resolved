import ActivityFragment from "@/graphql/fragments/activity";
import gql from "graphql-tag";

const GetUserFavoritesActivities = gql`
    query GetUserFavoritesActivities {
        getUserFavoritesActivities {
            ...Activity
        }
    }
    ${ActivityFragment}
`;

export default GetUserFavoritesActivities;