import { toShortDateTime } from '../../api/date';

function formatLoanToTableView(loan) {
  return {
    ID: loan.loan_pid,
    'Request created': toShortDateTime(loan.created),
    'Patron ID': loan.patron_pid,
    State: loan.state,
  };
}

function formatDocumentToTableView(document) {
  const serialized = {
    ID: document.document_pid,
    Title: document.title,
  };
  if (document.circulation) {
    serialized['Loan requests'] = document.circulation.pending_loans;
    serialized['Loanable items'] = document.circulation.loanable_items;
  }
  return serialized;
}

export const formatter = {
  loan: { toTable: formatLoanToTableView },
  document: { toTable: formatDocumentToTableView },
};
