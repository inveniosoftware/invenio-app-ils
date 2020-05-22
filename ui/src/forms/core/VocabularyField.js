import React from 'react';
import PropTypes from 'prop-types';
import { vocabulary as vocabularyApi } from '@api';
import { SelectField } from './SelectField';
import { invenioConfig } from '@config';
import { AccordionField } from './AccordionField';
import { withCancel } from '@api/utils';

export class VocabularyField extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      error: null,
      entries: [],
    };
  }

  componentDidMount() {
    const serializer = this.props.serializer || this.serializer;
    this.fetchVocabularies(serializer);
  }

  componentWillUnmount() {
    this.cancellableFetchData && this.cancellableFetchData.cancel();
  }

  query = () => {
    const searchQuery = vocabularyApi
      .query()
      .withType(this.props.type)
      .withSize(invenioConfig.max_results_window)
      .qs();
    return vocabularyApi.list(searchQuery);
  };

  serializer = hit => ({
    key: hit.metadata.id,
    value: hit.metadata.key,
    text: hit.metadata.text,
  });

  fetchVocabularies = async serializer => {
    this.cancellableFetchData = withCancel(this.query());
    try {
      const response = await this.cancellableFetchData.promise;
      const entries = response.data.hits.map(hit => serializer(hit));
      this.setState({ isLoading: false, entries: entries, error: null });
    } catch (error) {
      if (error !== 'UNMOUNTED') {
        this.setState({
          isloading: false,
          entries: [
            { key: '', value: '', text: 'Failed to load vocabularies.' },
          ],
          error: {
            content: 'Failed to load vocabularies.',
            pointing: 'above',
          },
        });
      }
    }
  };

  render() {
    const {
      accordion,
      fieldPath,
      label,
      multiple,
      serializer,
      type,
      ...uiProps
    } = this.props;
    const { isLoading, entries } = this.state;
    const noResultsMessage = isLoading
      ? 'Loading options...'
      : `No ${type} vocabularies found.`;
    const selectField = (
      <SelectField
        search
        fieldPath={fieldPath}
        label={accordion ? null : label}
        multiple={multiple}
        error={this.state.error}
        options={entries}
        loading={isLoading}
        upward={false}
        noResultsMessage={noResultsMessage}
        {...uiProps}
      />
    );

    if (accordion) {
      return (
        <AccordionField
          fieldPath={fieldPath}
          label={label}
          content={selectField}
        />
      );
    }

    return selectField;
  }
}

VocabularyField.propTypes = {
  accordion: PropTypes.bool,
  fieldPath: PropTypes.string.isRequired,
  label: PropTypes.string,
  multiple: PropTypes.bool,
  serializer: PropTypes.func,
  type: PropTypes.string.isRequired,
};

VocabularyField.defaultProps = {
  accordion: false,
  multiple: false,
};
