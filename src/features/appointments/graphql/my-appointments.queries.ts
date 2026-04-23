import { gql } from "@apollo/client";

export const GET_MY_APPOINTMENTS = gql`
  query GetMyAppointments($patientId: ID!) {
    getPatientAppointments(patientId: $patientId) {
      id
      appointmentDate
      appointmentTime
      dentist {
        firstName
        lastName
      }
      surgery {
        id
        name
      }
    }
  }
`;
