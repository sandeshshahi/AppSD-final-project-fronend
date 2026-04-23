import { gql } from "@apollo/client";

export const GET_ALL_PATIENTS = gql`
  query GetAllPatients {
    getAllPatients {
      id
      firstName
      lastName
      email
    }
  }
`;

export const UPLOAD_XRAY = gql`
  mutation UploadXRay(
    $patientId: ID!
    $base64Image: String!
    $description: String!
  ) {
    uploadXRay(
      patientId: $patientId
      base64Image: $base64Image
      description: $description
    ) {
      id
      imageUrl
      description
    }
  }
`;

export const GET_MY_PATIENTS = gql`
  query GetMyPatients($dentistId: ID!) {
    getPatientsForDentist(dentistId: $dentistId) {
      id
      firstName
      lastName
      email
      appointments {
        id
        appointmentDate
        appointmentTime
        dentist {
          id
          email
        }
      }
    }
  }
`;
