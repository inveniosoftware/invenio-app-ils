import React from 'react';
import PropTypes from 'prop-types';
import { vocabulary as vocabularyApi } from '@api';
import { SelectField } from './SelectField';
import { invenioConfig } from '@config';
import { AccordionField } from './AccordionField';

export class VocabularyField extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      error: null,
      options: [],
    };
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
    try {
      const response = await this.query();
      const options = response.data.hits.map(hit => serializer(hit));

      this.setState({ isLoading: false, options: options, error: null });
    } catch (error) {
      this.setState({
        isloading: false,
        options: [{ key: '', value: '', text: 'Failed to load vocabularies.' }],
        error: {
          content: 'Failed to load vocabularies.',
          pointing: 'above',
        },
      });
    }
  };

  componentDidMount() {
    const serializer = this.props.serializer || this.serializer;
    this.fetchVocabularies(serializer);
  }

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
    const { isLoading, options } = this.state;
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
        options={options}
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
