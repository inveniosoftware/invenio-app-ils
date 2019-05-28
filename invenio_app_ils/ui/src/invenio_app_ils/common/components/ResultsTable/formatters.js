import { fromISO, toShortDate, toShortDateTime } from '../../api/date';
import isEmpty from 'lodash/isEmpty';
import assign from 'lodash/assign';

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
  if (!isEmpty(document.metadata)) {
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

function formatEItemToTableView(eitem) {
  return {
    ID: eitem.eitem_pid ? eitem.eitem_pid : eitem.id,
    'Document ID': eitem.metadata.document_pid,
    'Open access': eitem.metadata.open_access
      ? eitem.metadata.open_access
      : false,
    Created: toShortDate(fromISO(eitem.created)),
    Updated: toShortDate(fromISO(eitem.updated)),
    Description: eitem.metadata.description,
    'Internal Notes': eitem.metadata.internal_notes,
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

function formatInternalLocationToTableView(internalLoc) {
  let entry = {
    ID: internalLoc.item_pid ? internalLoc.item_pid : internalLoc.id,
    Created: toShortDate(fromISO(internalLoc.created)),
    Updated: toShortDate(fromISO(internalLoc.updated)),
    Link: internalLoc.links.self,
  };
  if (!isEmpty(internalLoc.metadata)) {
    assign(entry, {
      Name: internalLoc.metadata.name,
      'Physical location': internalLoc.metadata.physical_location,
      'Location e-mail': internalLoc.metadata.location.email,
      'Location name': internalLoc.metadata.location.name,
      'Location id': internalLoc.metadata.location.location_pid,
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
  eitem: { toTable: formatEItemToTableView },
  location: { toTable: formatLocationToTableView },
  internalLocation: { toTable: formatInternalLocationToTableView },
  patron: { toTable: formatPatronToTableView },
};
