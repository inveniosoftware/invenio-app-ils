import React from 'react';
import PropTypes from 'prop-types';
import history from '../../../../../history';
import { ResultsTable } from '../../../../../common/components';
import { loan as loanApi } from '../../../../../common/api';
import { BackOfficeRoutes } from '../../../../../routes/urls';
import { formatter } from '../../../../../common/components/ResultsTable/formatters';
import { SeeAllButton } from '../../../components/buttons';
import pick from 'lodash/pick';

const showDetailsHandler = loanPid => {
  history.push(BackOfficeRoutes.loanDetailsFor(loanPid));
};

const seeAllButton = documentPid => {
  const click = () =>
    history.push(
      BackOfficeRoutes.loansListWithQuery(
        loanApi
          .query()
          .withDocPid(documentPid)
          .withState('PENDING')
          .qs()
      )
    );
  return <SeeAllButton clickHandler={() => click()} />;
};

const prepareData = data => {
  return data.hits.map(row => {
    const serialized = formatter.loan.toTable(row);
    return pick(serialized, ['ID', 'Updated', 'Patron ID', 'Start date']);
  });
};

const DocumentPendingLoans = ({ data, documentPid, showMaxRows }) => {
  const rows = prepareData(data);
  rows.totalHits = data.total;
  return (
    <ResultsTable
      rows={rows}
      title={'Pending loans requests'}
      name={'pending loan requests'}
      rowActionClickHandler={showDetailsHandler}
      seeAllComponent={seeAllButton(documentPid)}
      showMaxRows={showMaxRows}
    />
  );
};

DocumentPendingLoans.propTypes = {
  documentPid: PropTypes.string.isRequired,
  showMaxRows: PropTypes.number.isRequired,
  data: PropTypes.oneOfType([
    () => null,
    PropTypes.shape({
      total: PropTypes.number.isRequired,
      hits: PropTypes.shape({
        hits: PropTypes.arrayOf(
          PropTypes.shape({
            item_pid: PropTypes.string.isRequired,
            metadata: PropTypes.object.isRequired, // Replace with loan metadata
          })
        ),
      }).isRequired,
    }),
  ]).isRequired,
};

DocumentPendingLoans.defaultProps = {
  showMaxRows: 2,
};

export default DocumentPendingLoans;
