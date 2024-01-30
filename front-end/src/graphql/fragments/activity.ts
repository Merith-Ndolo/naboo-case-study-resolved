import gql from "graphql-tag";
import OwnerFragment from "./owner";

const ActivityFragment = gql`
  fragment Activity on ActivityDto {
    id
    city
    description
    name
    price
    addedByUsersAsFavorites
    owner {
      ...Owner
    }
    createdAt
  }
  ${OwnerFragment}
`;

export default ActivityFragment;
