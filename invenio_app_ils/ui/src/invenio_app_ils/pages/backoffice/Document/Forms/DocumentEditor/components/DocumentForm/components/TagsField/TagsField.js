import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FieldArray, getIn } from 'formik';
import { Form, Button, Label, Icon, Segment } from 'semantic-ui-react';
import { tag as tagApi } from '../../../../../../../../../common/api/tags/tag';
import { ESSelectorModal } from '../../../../../../../../../common/components/ESSelector';
import { serializeTag } from '../../../../../../../../../common/components/ESSelector/serializer';
import { CreateNewTagForm } from './components';
import { AccordionField } from '../../../../../../../../../forms';

export class TagsField extends Component {
  constructor(props) {
    super(props);
    this.fieldPath = props.fieldPath;
    this.label = props.label;
  }

  renderError(errors, name, direction = 'above') {
    const error = errors[name];
    return error
      ? {
          content: error,
          pointing: direction,
        }
      : null;
  }

  renderTagsField = props => {
    const {
      form: { values, setFieldValue },
      ...arrayHelpers
    } = props;
    const tags = getIn(values, this.fieldPath, []);
    const tagSelection = tags.map(tag => serializeTag({ metadata: tag }));

    return (
      <AccordionField
        label="Tags"
        fieldPath="tags"
        content={
          <>
            <Form.Field>
              <Segment>
                <Form.Group>
                  {getIn(values, this.fieldPath, []).map((tag, index) => (
                    <Form.Field key={`${this.fieldPath}.${index}`}>
                      <Label color="blue">
                        {tag.name}
                        <Icon
                          name="delete"
                          onClick={() => arrayHelpers.remove(index)}
                        />
                      </Label>
                    </Form.Field>
                  ))}
                </Form.Group>
              </Segment>
            </Form.Field>
            <Form.Field>
              <ESSelectorModal
                multiple
                initialSelections={tagSelection}
                trigger={
                  <Button
                    basic
                    color="blue"
                    size="small"
                    content={tags.length > 0 ? 'Edit tags' : 'Add new tag'}
                    type="button"
                  />
                }
                query={tagApi.list}
                serializer={serializeTag}
                title="Select Tags"
                onSave={results => {
                  setFieldValue(
                    this.fieldPath,
                    results.map(tag => ({ ...tag.metadata }))
                  );
                }}
              ></ESSelectorModal>
              <CreateNewTagForm
                title="Create new tag"
                successSubmitMessage="Your tag has been created."
              />
            </Form.Field>
          </>
        }
      />
    );
  };

  render() {
    return (
      <FieldArray name={this.fieldPath} component={this.renderTagsField} />
    );
  }
}

TagsField.propTypes = {
  fieldPath: PropTypes.string.isRequired,
  label: PropTypes.string,
};

TagsField.defaultProps = {
  label: '',
};
