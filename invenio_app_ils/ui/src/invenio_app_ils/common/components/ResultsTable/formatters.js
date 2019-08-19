import { fromISO, toShortDate, toShortDateTime } from '../../api/date';
import isEmpty from 'lodash/isEmpty';
import assign from 'lodash/assign';
import { formatPidTypeToName } from '../ManageRelationsButton/utils';

function formatLoanToTableView(loan) {
  return {
    ID: loan.pid ? loan.pid : loan.id,
    Created: toShortDateTime(fromISO(loan.created)),
    Updated: toShortDateTime(fromISO(loan.updated)),
    'Patron ID': loan.metadata.patron_pid,
    'Document ID': loan.metadata.document_pid,
    State: loan.metadata.state,
    'Item barcode': loan.metadata.item ? loan.metadata.item.barcode : null,
    'Start date': toShortDate(fromISO(loan.metadata.start_date)),
    'End date': toShortDate(fromISO(loan.metadata.end_date)),
    'Transaction date': toShortDateTime(
      fromISO(loan.metadata.transaction_date)
    ),
    'Expiration date': toShortDateTime(
      fromISO(loan.metadata.request_expire_date)
    ),
    Renewals: loan.metadata.extension_count,
  };
}

function formatDocumentToTableView(document, volume = null) {
  let serialized = {
    ID: document.pid ? document.pid : document.id,
    Created: toShortDate(fromISO(document.created)),
    Updated: toShortDate(fromISO(document.updated)),
  };
  if (!isEmpty(document.metadata)) {
    serialized['Title'] = document.metadata.title;
    serialized['Authors'] = document.metadata.authors;
    if (document.metadata.circulation) {
      serialized['Requests'] = document.metadata.circulation.pending_loans;
      serialized['Available Items'] =
        document.metadata.circulation.has_items_for_loan;
      serialized['# Loans'] =
        document.metadata.circulation.number_of_past_loans;
    }
    if (volume) {
      serialized['Volume'] = volume;
    }
  }
  return serialized;
}

function formatItemToTableView(item) {
  return {
    ID: item.pid ? item.pid : item.id,
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
    ID: eitem.pid ? eitem.pid : eitem.id,
    'Document ID': eitem.metadata.pid,
    'Open access': eitem.metadata.open_access ? 'Yes' : 'No',
    Created: toShortDate(fromISO(eitem.created)),
    Updated: toShortDate(fromISO(eitem.updated)),
    Description: eitem.metadata.description,
    'Internal Notes': eitem.metadata.internal_notes,
  };
}

function formatLocationToTableView(location) {
  return {
    ID: location.pid ? location.pid : location.id,
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
      'Location id': internalLoc.metadata.location.pid,
    });
  }
  return entry;
}

function formatSeriesToTableView(series) {
  let serialized = {
    ID: series.pid ? series.pid : series.id,
    Created: toShortDate(fromISO(series.created)),
    Updated: toShortDate(fromISO(series.updated)),
  };
  if (!isEmpty(series.metadata)) {
    serialized['Title'] = series.metadata.title.title;
    serialized['Mode of Issuance'] = series.metadata.mode_of_issuance;
    if (series.metadata.authors && !isEmpty(series.metadata.authors)) {
      serialized['Authors'] = series.metadata.authors;
    } else {
      serialized['Authors'] = [];
    }
  }

  return serialized;
}

function formatPatronToTableView(patron) {
  return {
    ID: patron.metadata.id,
    Name: patron.metadata.name,
    Email: patron.metadata.email,
  };
}

function formatRelatedToTableView(related, relation) {
  const obj = {
    ID: related.pid,
    Type: formatPidTypeToName(related.pid_type),
    Title:
      related.title && related.title.title
        ? related.title.title
        : related.title,
    Edition: related.edition,
    Language: related.language,
    Volume: related.volume,
    Note: related.note,
    Relation: relation,
  };
  return obj;
}

export const formatter = {
  loan: { toTable: formatLoanToTableView },
  document: { toTable: formatDocumentToTableView },
  item: { toTable: formatItemToTableView },
  eitem: { toTable: formatEItemToTableView },
  location: { toTable: formatLocationToTableView },
  internalLocation: { toTable: formatInternalLocationToTableView },
  series: { toTable: formatSeriesToTableView },
  patron: { toTable: formatPatronToTableView },
  related: { toTable: formatRelatedToTableView },
};
