import { gql } from "@apollo/client";

export const CREATE_DENTIST = gql`
  mutation CreateDentist($input: CreateDentistInput!) {
    createDentist(input: $input) {
      id
      firstName
      lastName
      specialization
    }
  }
`;
