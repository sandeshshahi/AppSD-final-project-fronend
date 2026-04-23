import { gql } from "@apollo/client";

export const GET_ALL_CLINIC_PATIENTS = gql`
  query GetAllClinicPatients {
    getAllPatients {
      id
      firstName
      lastName
      email
      appointments {
        id
        appointmentDate
        appointmentTime
        dentist {
          firstName
          lastName
        }
      }
    }
  }
`;
