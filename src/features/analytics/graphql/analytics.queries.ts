import { gql } from "@apollo/client";

export const GET_CLINIC_STATS = gql`
  query GetClinicStats {
    getClinicStats {
      totalPatients
      totalAppointments
      totalRevenue
      unpaidInvoicesCount
      topDentistName
    }
  }
`;
