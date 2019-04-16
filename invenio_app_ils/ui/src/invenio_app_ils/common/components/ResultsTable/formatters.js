import { fromISO, toShortDate, toShortDateTime } from '../../api/date';
import _isEmpty from 'lodash/isEmpty';
import assign from 'lodash/object';

function formatLoanToTableView(loan) {
  return {
    ID: loan.loan_pid ? loan.loan_pid : loan.id,
    Created: toShortDateTime(fromISO(loan.created)),
    Updated: toShortDateTime(fromISO(loan.updated)),
    'Patron ID': loan.metadata.patron_pid,
    'Document ID': loan.metadata.document_pid,
    State: loan.metadata.state,
    'Item barcode': loan.metadata.item ? loan.metadata.item.barcode : null,
    'Start date': toShortDateTime(fromISO(loan.metadata.start_date)),
    'End date': toShortDateTime(fromISO(loan.metadata.end_date)),
    'Transaction date': toShortDateTime(
      fromISO(loan.metadata.transaction_date)
    ),
    'Expiration date': toShortDateTime(
      fromISO(loan.metadata.request_expire_date)
    ),
    Renewals: loan.metadata.extension_count,
  };
}

function formatDocumentToTableView(document) {
  let serialized = {
    ID: document.document_pid ? document.document_pid : document.id,
    Created: toShortDate(fromISO(document.created)),
    Updated: toShortDate(fromISO(document.updated)),
  };
  if (!_isEmpty(document.metadata)) {
    serialized['Title'] = document.metadata.title;
    serialized['Authors'] = document.metadata.authors;
    if (document.metadata.circulation) {
      serialized['Requests'] = document.metadata.circulation.pending_loans;
      serialized['Items'] =
        document.metadata.circulation.items_available_for_loan;
    }
  }
  return serialized;
}

function formatItemToTableView(item) {
  return {
    ID: item.item_pid ? item.item_pid : item.id,
    Created: toShortDate(fromISO(item.created)),
    Updated: toShortDate(fromISO(item.updated)),
    Barcode: item.metadata.barcode,
    'Document ID': item.metadata.document_pid,
    Status: item.metadata.status,
    Medium: item.metadata.medium,
    'Circulation status': item.metadata.circulation_status
      ? item.metadata.circulation_status.state
      : null,
    'Internal location': item.metadata.internal_location
      ? item.metadata.internal_location.name
      : null,
    Location: item.metadata.internal_location.location
      ? item.metadata.internal_location.location.name
      : null,
    Shelf: item.metadata.shelf,
  };
}

function formatLocationToTableView(location) {
  return {
    ID: location.location_pid ? location.location_pid : location.id,
    Created: toShortDate(fromISO(location.created)),
    Updated: toShortDate(fromISO(location.updated)),
    Link: location.links.self,
    Name: location.metadata.name,
    Address: location.metadata.address,
    Email: location.metadata.email,
  };
}

function formatInternalLocationToTableView(internal_loc) {
  let entry = {
    ID: internal_loc.item_pid ? internal_loc.item_pid : internal_loc.id,
    Created: toShortDate(fromISO(internal_loc.created)),
    Updated: toShortDate(fromISO(internal_loc.updated)),
    Link: internal_loc.links.self,
  };
  if (!_isEmpty(internal_loc.metadata)) {
    assign(entry, {
      Name: internal_loc.metadata.name,
      'Physical location': internal_loc.metadata.physical_location,
      'Location e-mail': internal_loc.metadata.location.email,
      'Location name': internal_loc.metadata.location.name,
      'Location id': internal_loc.metadata.location.location_pid,
    });
  }
  return entry;
}

function formatPatronToTableView(patron) {
  return {
    ID: patron.metadata.id,
    Name: patron.metadata.name,
    Email: patron.metadata.email,
  };
}
export const formatter = {
  loan: { toTable: formatLoanToTableView },
  document: { toTable: formatDocumentToTableView },
  item: { toTable: formatItemToTableView },
  location: { toTable: formatLocationToTableView },
  internalLocation: { toTable: formatInternalLocationToTableView },
  patron: { toTable: formatPatronToTableView },
};
