import React from 'react';
import PropTypes from 'prop-types';
import { ResultsTable } from '../../../../../common/components';
import { item as itemApi } from '../../../../../common/api';
import history from '../../../../../history';
import {
  itemSearchQueryUrl,
  viewItemDetailsUrl,
} from '../../../../../common/urls';
import { SeeAllButton } from '../../../components/buttons';
import { formatter } from '../../../../../common/components/ResultsTable/formatters';
import pick from 'lodash/pick';

const showDetailsHandler = item_pid => {
  history.push(viewItemDetailsUrl(item_pid));
};

const seeAllButton = documentPid => {
  const _click = () =>
    history.push(
      itemSearchQueryUrl(
        itemApi
          .query()
          .withDocPid(documentPid)
          .qs()
      )
    );
  return <SeeAllButton clickHandler={() => _click()} />;
};

const prepareData = data => {
  return data.hits.map(row => {
    const entry = formatter.item.toTable(row);
    return pick(entry, [
      'ID',
      'Barcode',
      'Status',
      'Medium',
      'Location',
      'Shelf',
    ]);
  });
};

export const DocumentItems = ({ data, documentPid, showMaxRows }) => {
  const rows = prepareData(data);
  rows.totalHits = data.total;
  return (
    <ResultsTable
      rows={rows}
      title={'Attached items'}
      name={'attached items'}
      rowActionClickHandler={showDetailsHandler}
      seeAllComponent={seeAllButton(documentPid)}
      showMaxRows={showMaxRows}
    />
  );
};

DocumentItems.propTypes = {
  showMaxRows: PropTypes.number.isRequired,
  documentPid: PropTypes.string.isRequired,
  data: PropTypes.oneOfType([
    () => null,
    PropTypes.shape({
      total: PropTypes.number.isRequired,
      hits: PropTypes.shape({
        hits: PropTypes.arrayOf(
          PropTypes.shape({
            item_pid: PropTypes.string.isRequired,
            metadata: PropTypes.object.isRequired, // Replace with item metadata
          })
        ),
      }).isRequired,
    }),
  ]).isRequired,
};

DocumentItems.defaultProps = {
  showMaxRows: 5,
};
