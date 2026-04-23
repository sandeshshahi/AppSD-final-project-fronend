import { gql } from "@apollo/client";

export const GET_MY_INVOICES = gql`
  query GetMyInvoices {
    myInvoices {
      id
      amount
      issueDate
      status
    }
  }
`;

export const PAY_INVOICE = gql`
  mutation PayInvoice($invoiceId: ID!) {
    payInvoice(invoiceId: $invoiceId) {
      id
      status
    }
  }
`;

export const GET_ALL_INVOICES = gql`
  query GetAllInvoices {
    getAllInvoices {
      id
      amount
      issueDate
      status
      patient {
        firstName
        lastName
        email
      }
    }
  }
`;

export const CREATE_INVOICE = gql`
  mutation CreateInvoice($appointmentId: ID!, $amount: Float!) {
    createInvoice(appointmentId: $appointmentId, amount: $amount) {
      id
      amount
      status
    }
  }
`;
