import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Header,
  Icon,
  Modal,
  Grid,
  Segment,
  Label,
} from 'semantic-ui-react';
import './DocumentAccessRestrictions.scss';
import { PatronSearchBox } from '../../../../../common/components/PatronSearchBox';
import { isEmpty } from 'lodash';

export default class DocumentAccessRestrictions extends Component {
  constructor(props) {
    super(props);
    this.setRestrictionsOnDocument = props.setRestrictionsOnDocument;
    this.pid = props.document.document_pid;
    this.state = {
      isModalOpen: false,
      currentAccessList: props.readAccessSet,
    };
  }

  toggleModal = () =>
    this.setState({
      isModalOpen: !this.state.isModalOpen,
    });

  handleRemoveSelection = email => e => {
    const newList = new Set(
      Array.from(this.state.currentAccessList).filter(item => email !== item)
    );

    this.setState({
      currentAccessList: newList,
    });
  };

  clearSelection = () => this.setState({ currentAccessList: new Set([]) });

  renderCurrentSelection = () => {
    const labels = Array.from(this.state.currentAccessList).map(email => (
      <div className="current-selection-labels" key={email}>
        <Label as="a" color="blue">
          {email}
          <Icon name="delete" onClick={this.handleRemoveSelection(email)} />
        </Label>
      </div>
    ));
    return labels ? <div>{labels}</div> : null;
  };

  handleUpdateSelection = selected => {
    const newList = new Set([
      ...Array.from(this.state.currentAccessList),
      selected.title,
    ]);
    this.setState({
      currentAccessList: newList,
    });
  };

  renderModalActions = () => {
    return (
      <Modal.Actions>
        <Button
          color="red"
          onClick={() => {
            this.toggleModal();
            this.clearSelection();
          }}
        >
          <Icon name="remove" /> Cancel
        </Button>
        <Button
          toggle
          color="green"
          onClick={() => {
            this.setRestrictionsOnDocument(
              this.pid,
              Array.from(this.state.currentAccessList)
            );
            this.toggleModal();
          }}
        >
          <Icon name="checkmark" />
          {isEmpty(this.state.currentAccessList)
            ? 'Make document public'
            : 'Modify Access Restrictions'}
        </Button>
      </Modal.Actions>
    );
  };

  renderModalContent = () => {
    return (
      <div>
        <Grid>
          <Grid.Column width={6}>
            <PatronSearchBox
              handleUpdateSelection={this.handleUpdateSelection}
              readAccessSet={this.props.readAccessSet}
              minCharacters={3}
            />
          </Grid.Column>
          <Grid.Column width={10}>
            <Segment>
              <Header>Current Access</Header>
              {this.state.currentAccessList.size === 0
                ? 'No restrictions set.'
                : null}
              <pre style={{ overflowX: 'auto' }}>
                {this.renderCurrentSelection()}
              </pre>
            </Segment>
          </Grid.Column>
        </Grid>
      </div>
    );
  };

  render() {
    const { isModalOpen } = this.state;
    return (
      <Modal
        className="access-restrictions-modal"
        trigger={
          <Button color="yellow" onClick={this.toggleModal}>
            <Icon size="big" name="privacy" />
            Set Access Restrictions
          </Button>
        }
        open={isModalOpen}
        onClose={() => {
          this.toggleModal();
          this.clearSelection();
        }}
        closeIcon
      >
        <Header icon="universal access" content="Set Restrictions" />

        <Modal.Content>{this.renderModalContent()}</Modal.Content>

        <Modal.Actions>{this.renderModalActions()}</Modal.Actions>
      </Modal>
    );
  }
}

DocumentAccessRestrictions.propTypes = {
  document: PropTypes.object.isRequired,
  readAccessSet: PropTypes.object.isRequired,
};
