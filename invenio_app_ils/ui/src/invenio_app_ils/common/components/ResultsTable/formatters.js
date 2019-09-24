import React from 'react';
import { Link } from 'react-router-dom';
import { fromISO, toShortDate, toShortDateTime } from '../../api/date';
import isEmpty from 'lodash/isEmpty';
import assign from 'lodash/assign';
import { formatPidTypeToName } from '../ManageRelationsButton/utils';
import { loan as loanApi } from '../../api';
import { BackOfficeRoutes, FrontSiteRoutes } from '../../../routes/urls';
import { invenioConfig } from '../../config';
import startCase from 'lodash/startCase';

function formatLoanToTableView(loan, actions = null) {
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
    serialized['Title'] = document.metadata.title.title;
    serialized['Authors'] = document.metadata.authors
      .map(author => author.full_name)
      .join(',');
    if (document.metadata.circulation) {
      serialized['Requests'] = document.metadata.circulation.pending_loans;
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

function formatMostLoanedDocumentToTableView(document, fromDate, toDate) {
  let serialized = formatDocumentToTableView(document);
  if (serialized.Title) {
    const documentUrl = BackOfficeRoutes.documentDetailsFor(serialized.ID);
    serialized['Title'] = <Link to={documentUrl}>{serialized.Title}</Link>;
  }
  if (!isEmpty(document.metadata)) {
    if (document.metadata.loan_count) {
      const query = loanApi
        .query()
        .withDocPid(serialized.ID)
        .withStartDate({ fromDate, toDate })
        .withState(
          invenioConfig.circulation.loanActiveStates.concat(
            invenioConfig.circulation.loanCompletedStates
          )
        )
        .qs();
      const url = BackOfficeRoutes.loansListWithQuery(query);
      serialized['Loan Count'] = (
        <Link to={url}>{document.metadata.loan_count}</Link>
      );
      serialized['Extension Count'] = document.metadata.loan_extensions;
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
    Actions: location.actions,
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
  entry['Actions'] = internalLoc.actions;
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

function formatDocumentRequestToTableView(req) {
  const request = {
    ID: req.pid ? req.pid : req.id,
    Created: toShortDate(fromISO(req.created)),
    Updated: toShortDate(fromISO(req.updated)),
    'Document ID': req.metadata.document_pid,
    'Patron ID': req.metadata.patron_pid,
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
  if (req.metadata.state === 'FULFILLED') {
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
  item: { toTable: formatItemToTableView },
  loan: { toTable: formatLoanToTableView },
  mostLoanedDocument: { toTable: formatMostLoanedDocumentToTableView },
  related: { toTable: formatRelatedToTableView },
  series: { toTable: formatSeriesToTableView },
  internalLocation: formatInternalLocationToTableView,
  location: formatLocationToTableView,
  patron: formatPatronToTableView,
};
