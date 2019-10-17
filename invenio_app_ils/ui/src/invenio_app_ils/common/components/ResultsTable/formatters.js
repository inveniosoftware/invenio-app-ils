import React from 'react';
import { Link } from 'react-router-dom';
import { fromISO, toShortDate } from '../../api/date';
import isEmpty from 'lodash/isEmpty';
import assign from 'lodash/assign';
import { formatPidTypeToName } from '../ManageRelationsButton/utils';
import { FrontSiteRoutes } from '../../../routes/urls';
import { TRUNCATE_LENGTH } from '../../config';
import startCase from 'lodash/startCase';
import truncate from 'lodash/truncate';

function formatLoanToTableView(loan, actions = null) {
  const requestStartDate = loan.metadata.request_start_date
    ? toShortDate(fromISO(loan.metadata.request_start_date))
    : null;
  const requestEndDate = loan.metadata.request_expire_date
    ? toShortDate(fromISO(loan.metadata.request_expire_date))
    : null;
  const startDate = loan.metadata.start_date
    ? toShortDate(fromISO(loan.metadata.start_date))
    : null;
  const endDate = loan.metadata.end_date
    ? toShortDate(fromISO(loan.metadata.end_date))
    : null;
  return {
    ID: loan.pid ? loan.pid : loan.id,
    'Patron ID': loan.metadata.patron_pid,
    'Document ID': loan.metadata.document_pid,
    Patron: loan.metadata.patron.name,
    State: loan.metadata.state,
    'Item barcode': loan.metadata.item ? loan.metadata.item.barcode : null,
    'Request start date': requestStartDate,
    'Request end date': requestEndDate,
    'Start date': startDate,
    'End date': endDate,
    Renewals: loan.metadata.extension_count,
    Actions: actions,
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
    serialized['Authors'] = document.metadata.authors
      .map(author => author.full_name)
      .join(',');
    if (document.metadata.circulation) {
      serialized['Available Items'] =
        document.metadata.circulation.has_items_for_loan;
      serialized['Overdue Loans'] = document.metadata.circulation.overdue_loans;
      serialized['Pending Requests'] =
        document.metadata.circulation.pending_loans;
      serialized['Past Loans Count'] =
        document.metadata.circulation.past_loans_count;
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
    'Document ID': item.metadata.document_pid,
    Created: toShortDate(fromISO(item.created)),
    Updated: toShortDate(fromISO(item.updated)),
    Barcode: item.metadata.barcode,
    Title: item.metadata.document.title,
    Medium: item.metadata.medium,
    Status: item.metadata.status,
    'Circulation status': item.metadata.circulation
      ? item.metadata.circulation.state
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
    'Document ID': eitem.metadata.document_pid,
    'Open access': eitem.metadata.open_access ? 'Yes' : 'No',
    Created: toShortDate(fromISO(eitem.created)),
    Updated: toShortDate(fromISO(eitem.updated)),
    Title: eitem.metadata.document.title,
    Description: truncate(eitem.metadata.description, {
      length: TRUNCATE_LENGTH,
    }),
    'Internal Notes': truncate(eitem.metadata.internal_notes, {
      length: TRUNCATE_LENGTH,
    }),
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
      'Location ID': internalLoc.metadata.location.pid,
      Name: internalLoc.metadata.name,
      'Physical location': internalLoc.metadata.physical_location,
      Location: internalLoc.metadata.location.name,
      'Location e-mail': internalLoc.metadata.location.email,
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
    serialized['Title'] = series.metadata.title;
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
    Title: related.title,
    Edition: related.edition,
    Language: related.language,
    Volume: related.volume,
    Note: related.note,
    Relation: relation,
  };
  return obj;
}

function formatDocumentRequestToTableView(req) {
  const request = {
    ID: req.pid ? req.pid : req.id,
    Created: toShortDate(fromISO(req.created)),
    Updated: toShortDate(fromISO(req.updated)),
    'Document ID': req.metadata.document_pid,
    'Patron ID': req.metadata.patron_pid,
    'Patron Name': req.metadata.patron.name,
    State: req.metadata.state,
    Title: req.metadata.title,
    Authors: req.metadata.authors,
    ISSN: req.metadata.issn,
    ISBN: req.metadata.isbn,
    Issue: req.metadata.issue,
    Note: req.metadata.note,
    Page: req.metadata.page,
    'Publication Year': req.metadata.publication_year,
    Volume: req.metadata.volume,
  };
  if (req.metadata.state === 'ACCEPTED') {
    request['Library Book'] = (
      <Link to={FrontSiteRoutes.documentDetailsFor(req.metadata.document_pid)}>
        {req.metadata.document.title}
      </Link>
    );
  } else {
    request['Library Book'] = startCase(req.metadata.state.toLowerCase());
  }
  return request;
}

export const formatter = {
  document: { toTable: formatDocumentToTableView },
  documentRequest: { toTable: formatDocumentRequestToTableView },
  eitem: { toTable: formatEItemToTableView },
  internalLocation: { toTable: formatInternalLocationToTableView },
  item: { toTable: formatItemToTableView },
  loan: { toTable: formatLoanToTableView },
  location: { toTable: formatLocationToTableView },
  patron: { toTable: formatPatronToTableView },
  related: { toTable: formatRelatedToTableView },
  series: { toTable: formatSeriesToTableView },
};
