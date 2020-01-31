import { recordToPidType } from '@api/utils';
import { Error, Loader, Pagination, ResultsTable } from '@components';
import { DocumentLanguages } from '@components/Document';
import { DocumentDetailsLink, InfoMessage } from '@pages/backoffice';
import { ExistingRelations } from '@pages/backoffice/Document/DocumentDetails/components/DocumentRelations/components/ExistingRelations';
import RelationEdition from '@pages/backoffice/Document/DocumentDetails/components/DocumentRelations/RelationEdition/RelationEdition';
import { RelationLanguagesModal } from '../RelationLanguages';
import { RelationRemover } from '../components';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tab } from 'semantic-ui-react';
import isEmpty from 'lodash/isEmpty';

export default class RelationLanguage extends Component {
  constructor(props) {
    super(props);
  }

  viewDetails = ({ row }) => {
    return (
      <DocumentDetailsLink documentPid={row.pid}>
        {row.title}
      </DocumentDetailsLink>
    );
  };

  removeHandler = ({ row }) => {
    const { documentDetails } = this.props;

    if (!isEmpty(documentDetails)) {
      return (
        <RelationRemover
          referer={documentDetails}
          related={row}
          relationPayloadType="siblings"
          buttonContent={'Remove relation'}
        />
      );
    }
  };

  languagesFormatter = ({ row }) => {
    return <DocumentLanguages metadata={row} />;
  };

  render() {
    const { relations, showMaxRows, isLoading, error } = this.props;
    const languages = relations['language'] || [];

    const columns = [
      { title: 'Title', field: 'title', formatter: this.viewDetails },
      { title: 'Type', field: 'pid_type' },
      {
        title: 'Language(s)',
        field: 'languages',
        formatter: this.languagesFormatter,
      },
      { title: 'Actions', field: '', formatter: this.removeHandler },
    ];

    return (
      <Loader isLoading={isLoading}>
        <Error error={error}>
          <RelationLanguagesModal relationType={'language'} />

          <ExistingRelations
            rows={languages}
            showMaxRows={showMaxRows}
            columns={columns}
            emptyMessage={
              <InfoMessage
                header={'No related languages'}
                content={'Use the button above to add related languages.'}
              />
            }
          />
        </Error>
      </Loader>
    );
  }
}

RelationLanguage.propTypes = {
  relations: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  documentDetails: PropTypes.object.isRequired,
};

RelationLanguage.defaultProps = {
  showMaxRows: 3,
};
