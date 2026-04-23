import { gql } from "@apollo/client";

export const GET_BOOKING_DATA = gql`
  query GetBookingData {
    getDentists {
      id
      firstName
      lastName
    }
    getSurgeries {
      id
      name
    }
  }
`;

export const BOOK_APPOINTMENT = gql`
  mutation BookAppointment($input: BookAppointmentInput!) {
    bookAppointment(input: $input) {
      id
      appointmentDate
      appointmentTime
    }
  }
`;

export const GET_ALL_CLINIC_APPOINTMENTS = gql`
  query GetAllClinicAppointments {
    getAllAppointments {
      id
      appointmentDate
      appointmentTime
      patient {
        firstName
        lastName
      }
      dentist {
        firstName
        lastName
      }
      invoice {
        id # We fetch this to check if a bill already exists!
      }
    }
  }
`;
