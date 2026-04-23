import { gql } from "@apollo/client";

export const CREATE_SURGERY = gql`
  mutation CreateSurgery($input: CreateSurgeryInput!) {
    createSurgery(input: $input) {
      id
      name
      locationAddress
      telephoneNumber
    }
  }
`;
