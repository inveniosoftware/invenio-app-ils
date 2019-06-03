import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import sumBy from 'lodash/sumBy';
import sortBy from 'lodash/sortBy';
import { Button, Header, Icon, Modal, Table, Segment } from 'semantic-ui-react';
import { Loader, Error } from '../../../../common/components';
import { DeleteButton } from './components/DeleteButton';
import './DeleteRecordModal.scss';

export default class DeleteRecordModal extends Component {
  state = { isModalOpen: false };

  constructor(props) {
    super(props);
    this.fetchReferences = props.fetchReferences;
    this.onDelete = props.onDelete;
  }

  toggleModal = () => this.setState({ isModalOpen: !this.state.isModalOpen });

  handleDeleteClick() {
    this.onDelete();
    this.toggleModal();
  }

  handleOpen() {
    const { refProps } = this.props;
    if (!isEmpty(refProps)) {
      this.fetchReferences(refProps.map(entry => entry.getRefData()));
    }
  }

  renderDeleteHeader = () => {
    const { deleteHeader } = this.props;
    return (
      <Header
        key={`deleteHeader`}
        icon={'trash alternate'}
        content={deleteHeader}
      />
    );
  };

  renderHeader = refEntry => {
    return (
      <Header
        key={`${refEntry}`}
        icon={'exclamation'}
        content={`You cannot delete the record, the following ${
          refEntry.refType
        } records use it!`}
      />
    );
  };

  renderContent = (refEntry, refData) => {
    const { refType, onRefClick } = refEntry;
    const references = sortBy(refData.hits, 'id').map((hit, i) => (
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
        <Modal.Content key={`${refType}_content`}>
          <Segment>
            <Table selectable basic="very" className="references-table">
              <Table.Body>{references}</Table.Body>
            </Table>
          </Segment>
        </Modal.Content>
      );
    }
  };

  renderActions = canDelete => {
    return (
      <Modal.Actions key={'modalActions'}>
        <Button onClick={this.toggleModal} basic inverted>
          <Icon name="remove" /> Cancel
        </Button>
        {canDelete ? (
          <Button color="red" onClick={() => this.handleDeleteClick()} inverted>
            <Icon name="trash alternate" />
            Delete
          </Button>
        ) : null}
      </Modal.Actions>
    );
  };

  renderAll() {
    const { data, refProps } = this.props;
    const canDelete = isEmpty(refProps) || sumBy(data, 'total') === 0;

    if (canDelete) {
      return [this.renderDeleteHeader(), this.renderActions(canDelete)];
    }

    const modalContent = [];
    modalContent.push(
      refProps.map((refEntry, idx) => {
        const refData = data[idx];
        if (refData.total > 0) {
          return [
            this.renderHeader(refEntry, canDelete),
            this.renderContent(refEntry, refData),
          ];
        }
        return null;
      })
    );
    modalContent.push(this.renderActions(canDelete));
    return modalContent;
  }

  render() {
    const { isLoading, error } = this.props;
    return (
      <Modal
        trigger={<DeleteButton onClick={this.toggleModal} />}
        open={this.state.isModalOpen}
        onOpen={() => this.handleOpen()}
        onClose={this.toggleModal}
        basic
      >
        <Loader isLoading={isLoading}>
          <Error error={error}>{this.renderAll()}</Error>
        </Loader>
      </Modal>
    );
  }
}

DeleteRecordModal.propTypes = {
  onDelete: PropTypes.func.isRequired,
  deleteHeader: PropTypes.string.isRequired,
  refProps: PropTypes.arrayOf(
    PropTypes.shape({
      refType: PropTypes.string.isRequired,
      onRefClick: PropTypes.func.isRequired,
      getRefData: PropTypes.func.isRequired,
    })
  ),
};

DeleteRecordModal.defaultProps = {
  refProps: [],
};
