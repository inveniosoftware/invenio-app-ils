import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Header, Icon, Modal, List } from 'semantic-ui-react';
import { Loader, Error } from '../../../../common/components';
import { DeleteButton } from '../buttons';
import { openRecordEditor } from '../../../../common/urls';

export default class DeleteRecordModal extends Component {
  state = { isModalOpen: false };

  constructor(props) {
    super(props);
    this.fetchReferences = props.fetchReferences;
    this.deleteFunction = props.deleteFunction;
  }

  toggleModal = () => this.setState({ isModalOpen: !this.state.isModalOpen });

  _renderActions = () => (
    <Modal.Actions>
      <Button onClick={this.toggleModal} basic inverted>
        <Icon name="remove" /> Cancel
      </Button>
      <Button color="red" onClick={() => this._handleDeleteClick()} inverted>
        <Icon name="checkmark" /> Delete
      </Button>
    </Modal.Actions>
  );

  _handleDeleteClick() {
    this.deleteFunction();
    this.toggleModal();
  }

  _renderReferences = data => {
    const { refApiUrl } = this.props;
    const rows = data.hits.map((hit, i) => (
      <List.Item
        onClick={() => openRecordEditor(refApiUrl, hit.id)}
        as="h1"
        key={i}
      >
        <Button icon>
          <Icon name="edit" />
        </Button>
        {hit.metadata.name}
      </List.Item>
    ));
    return (
      <>
        <Modal.Content>
          <List>{rows}</List>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={this.toggleModal} basic inverted>
            <Icon name="remove" /> Close
          </Button>
        </Modal.Actions>
      </>
    );
  };

  render() {
    const { isLoading, error, data, headerContent } = this.props;
    const canDelete = data.total === 0;
    return (
      <Modal
        trigger={<DeleteButton onClick={this.toggleModal} />}
        open={this.state.isModalOpen}
        onOpen={() => this.fetchReferences(this.props.checkRefs)}
        onClose={this.toggleModal}
        basic
      >
        <Header
          icon={canDelete ? 'trash alternate' : 'exclamation'}
          content={
            canDelete
              ? headerContent
              : 'You cannot delete the record, there are references to it'
          }
        />
        <Loader isLoading={isLoading}>
          <Error error={error}>
            {canDelete ? this._renderActions() : this._renderReferences(data)}
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
