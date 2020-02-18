import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import sumBy from 'lodash/sumBy';
import sortBy from 'lodash/sortBy';
import { Button, Header, Icon, Modal, Segment, List } from 'semantic-ui-react';
import { Loader, Error } from '@components';
import { DeleteButton } from './components/DeleteButton';

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
        content={`You cannot delete the record, the following ${refEntry.refType} records use it!`}
      />
    );
  };

  renderContent = (refEntry, refData) => {
    const { refType, onRefClick } = refEntry;
    const references = sortBy(refData.hits, 'id').map((hit, i) => (
      <List.Item
        key={i}
        as={'a'}
        onClick={() => onRefClick(hit.id)}
        target="blank"
      >
        <List.Content>
          {hit.record && <List.Header>{hit.record.title}</List.Header>}
          {refType} - #{hit.id} <Icon name="edit" />
        </List.Content>
      </List.Item>
    ));
    if (references.length > 0) {
      return (
        <Modal.Content key={`${refType}_content`}>
          <Segment>
            <List ordered celled>
              {references}
            </List>
          </Segment>
        </Modal.Content>
      );
    }
  };

  renderActions = canDelete => {
    return (
      <Modal.Actions key={'modalActions'}>
        <Button onClick={this.toggleModal}>
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

  renderAll = () => {
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
  };

  render() {
    const { isLoading, error } = this.props;
    const TriggerButton = this.props.trigger || DeleteButton;
    return (
      <Modal
        trigger={<TriggerButton onClick={this.toggleModal} />}
        open={this.state.isModalOpen}
        onOpen={() => this.handleOpen()}
        onClose={this.toggleModal}
      >
        <Loader isLoading={isLoading}>
          <Error error={error}>{<this.renderAll />}</Error>
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
  trigger: PropTypes.func,
};

DeleteRecordModal.defaultProps = {
  refProps: [],
};
