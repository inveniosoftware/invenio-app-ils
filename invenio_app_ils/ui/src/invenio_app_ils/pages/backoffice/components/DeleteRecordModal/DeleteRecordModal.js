import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Header, Icon, Modal, Table, Segment } from 'semantic-ui-react';
import { Loader, Error } from '../../../../common/components';
import { DeleteButton } from './components/DeleteButton';
import './DeleteRecordModal.scss';

export default class DeleteRecordModal extends Component {
  state = { isModalOpen: false };

  constructor(props) {
    super(props);
    this.fetchReferences = props.fetchReferences;
    this.deleteFunction = props.deleteFunction;
  }

  toggleModal = () => this.setState({ isModalOpen: !this.state.isModalOpen });

  _handleDeleteClick() {
    this.deleteFunction();
    this.toggleModal();
  }

  _renderContent = () => {
    const { data, refType, onRefClick } = this.props;
    const references = data.hits.map((hit, i) => (
      <Table.Row key={i}>
        <Table.Cell onClick={() => onRefClick(hit.id)}>
          <Header as="h4">
            {i + 1}. {refType} - {hit.id} <Icon name="edit" />
          </Header>
        </Table.Cell>
      </Table.Row>
    ));
    if (references.length > 0) {
      return (
        <Modal.Content>
          <Segment>
            <Table selectable basic="very" className="references-table">
              <Table.Body>{references}</Table.Body>
            </Table>
          </Segment>
        </Modal.Content>
      );
    }
  };

  _renderActions = () => {
    const { data } = this.props;
    const canDelete = data.total === 0;
    return (
      <Modal.Actions>
        <Button onClick={this.toggleModal} basic inverted>
          <Icon name="remove" /> Cancel
        </Button>
        {canDelete ? (
          <Button
            color="red"
            onClick={() => this._handleDeleteClick()}
            inverted
          >
            <Icon name="trash alternate" />
            Delete
          </Button>
        ) : null}
      </Modal.Actions>
    );
  };

  render() {
    const { isLoading, error, data, headerContent, refType } = this.props;
    const canDelete = data.total === 0;
    return (
      <Modal
        trigger={<DeleteButton onClick={this.toggleModal} />}
        open={this.state.isModalOpen}
        onOpen={() => this.fetchReferences(this.props.checkRefs)}
        onClose={this.toggleModal}
        basic
      >
        <Loader isLoading={isLoading}>
          <Error error={error}>
            <Header
              icon={canDelete ? 'trash alternate' : 'exclamation'}
              content={
                canDelete
                  ? headerContent
                  : `You cannot delete the record, the following ${refType} records use it!`
              }
            />
            {this._renderContent()}
            {this._renderActions()}
          </Error>
        </Loader>
      </Modal>
    );
  }
}

DeleteRecordModal.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  data: PropTypes.object,
  hasError: PropTypes.bool.isRequired,
};
