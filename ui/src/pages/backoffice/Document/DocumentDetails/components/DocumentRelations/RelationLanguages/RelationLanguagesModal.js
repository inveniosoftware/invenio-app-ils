import { DocumentLanguages } from '@components/Document';
import { DocumentSelectListEntry } from '@pages/backoffice/components/Document';
import {
  RelationModal,
  RelationSummary,
  RelationSelector,
  MultipleSelections,
} from '@pages/backoffice/components/Relations';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Container,
  Divider,
  Form,
  Icon,
  Label,
  Modal,
} from 'semantic-ui-react';
import { document as documentApi } from '@api';

export default class RelationLanguagesModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
    };
  }

  selectResultRender = (option, disabled) => {
    const description = (
      <>
        <label>languages:</label>{' '}
        <DocumentLanguages metadata={option.metadata} />
      </>
    );
    return (
      <DocumentSelectListEntry
        document={option}
        description={description}
        disabled={disabled}
        key={option.metadata.pid}
      />
    );
  };

  render() {
    const { documentDetails } = this.props;
    return (
      <RelationModal
        triggerButtonContent={'Add language relations'}
        modalHeader={
          <>
            Attach translations <Icon size="large" name="language" />
          </>
        }
        isLoading={this.state.isLoading}
        relationType={this.props.relationType}
        referrerRecord={documentDetails}
      >
        <Modal.Content>
          <Container textAlign="left">
            Select translations to create the relation.
            <Form>
              <Form.Group>
                <Container className="spaced">
                  <RelationSelector
                    existingRelations={this.props.relations.language}
                    optionsQuery={documentApi.list}
                    resultRenderer={this.selectResultRender}
                    referrerRecordPid={documentDetails.metadata.pid}
                  />
                </Container>
              </Form.Group>
            </Form>
          </Container>
          <Container textAlign="center">
            <Divider horizontal> Summary </Divider>
            <RelationSummary
              columnsWidths={{ left: 4, middle: 3, right: 9 }}
              currentReferrer={documentDetails}
              renderSelections={() => <MultipleSelections />}
              relationDescription={
                <>
                  <Icon size="large" name="arrows alternate horizontal" />
                  <br />
                  is a <Label color="blue">translation </Label> of
                </>
              }
            />
          </Container>
        </Modal.Content>
      </RelationModal>
    );
  }
}

RelationLanguagesModal.propTypes = {
  /* relations got from the current document, reducer */
  relations: PropTypes.object.isRequired,
  documentDetails: PropTypes.object.isRequired,
  relationType: PropTypes.string.isRequired,
};
