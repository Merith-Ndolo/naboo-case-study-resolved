import { gql } from "@apollo/client";

const ToggleFavoriteActivity = gql`
  mutation ToggleFavoriteActivity($activityId: String!) {
    toggleFavoriteActivity(activityId: $activityId) {
      name
      city
      description
      price
      addedByUsersAsFavorites
    }
  }
`;

export default ToggleFavoriteActivity;
