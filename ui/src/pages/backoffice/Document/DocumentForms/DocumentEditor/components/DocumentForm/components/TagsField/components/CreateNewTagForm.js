import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Icon } from 'semantic-ui-react';
import { BaseForm, StringField } from '@forms';
import { tag as tagApi } from '@api/tags/tag';

export class CreateNewTagForm extends Component {
  constructor(props) {
    super(props);
    this.successSubmitMessage = props.successSubmitMessage;
    this.title = props.title;
    this.state = {
      modelOpen: false,
    };
  }

  handleOpen = () => this.setState({ modalOpen: true });

  handleClose = () => this.setState({ modalOpen: false });

  createTag = data => {
    return tagApi.create(data);
  };

  render() {
    return (
      <Modal
        trigger={
          <Button color="teal" onClick={this.handleOpen} type="button">
            Create new tag
          </Button>
        }
        size="small"
        open={this.state.modalOpen}
        onClose={this.handleClose}
        closeIcon={
          <Icon name="close" color="red" onClick={this.handleClose}></Icon>
        }
      >
        <Modal.Content>
          <BaseForm
            initialValues={{}}
            createApiMethod={this.createTag}
            successCallback={this.handleClose}
            successSubmitMessage={this.successSubmitMessage}
            title={this.title}
          >
            <StringField label="Name" fieldPath="name" required />
            <StringField label="Provenance" fieldPath="provenance" />
          </BaseForm>
        </Modal.Content>
      </Modal>
    );
  }
}

CreateNewTagForm.propTypes = {
  successSubmitMessage: PropTypes.string,
  title: PropTypes.string,
};
