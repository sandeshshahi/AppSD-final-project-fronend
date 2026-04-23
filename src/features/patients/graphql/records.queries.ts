import { gql } from "@apollo/client";

export const GET_MY_XRAYS = gql`
  query GetMyXRays($patientId: ID!) {
    getPatientXRays(patientId: $patientId) {
      id
      imageUrl
      description
      uploadedAt
    }
  }
`;
