import React, { Component } from 'react';
import {
  Button,
  Header,
  Icon,
  Modal,
  Segment,
  Grid,
  Label,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { BackOfficeRoutes } from '../../../../../../../routes/urls';
import { goTo } from '../../../../../../../history';
import isEmpty from 'lodash/isEmpty';
import { PatronSearchBox } from '../../../../../../../common/components/PatronSearchBox';

export default class CreateNewLoanModal extends Component {
  constructor(props) {
    super(props);
    this.state = { open: false, currentSelection: null, disabledSearch: false };
    this.createNewLoanForItem = this.props.createNewLoanForItem.bind(this);
    this.onLoanCreatedCallback = this.props.onLoanCreatedCallback.bind(this);
  }

  componentDidMount() {
    this.props.resetNewLoanState();
  }

  close = () => {
    this.setState({ open: false }, () => {
      this.onLoanCreatedCallback(this.props.itemPid);
    });
  };

  checkoutNewLoan = (itemPid, loan, patronPid) => {
    loan.metadata.patron_pid = patronPid;
    this.createNewLoanForItem(itemPid, loan);
  };

  triggerButton = (
    <Button
      positive
      icon
      labelPosition="left"
      size="small"
      onClick={() => this.setState({ open: true })}
      disabled={!this.props.active}
    >
      <Icon name="add" />
      Checkout this item
    </Button>
  );

  gotoDetailsPage = loanPid => goTo(BackOfficeRoutes.loanDetailsFor(loanPid));

  handleUpdateSelection = selected => {
    this.setState({
      currentSelection: {
        patronEmail: selected.title,
        patronPid: selected.description,
      },
    });
  };

  handleRemoveSelection = () => {
    this.setState({
      currentSelection: null,
    });
  };

  renderSelection = () => {
    return this.state.currentSelection ? (
      <Label as="a" color="blue">
        {this.state.currentSelection.patronEmail}
        <Icon name="delete" onClick={this.handleRemoveSelection} />
      </Label>
    ) : null;
  };

  renderModalContent = () => {
    return (
      <div>
        <Grid>
          <Grid.Column width={6}>
            <PatronSearchBox
              handleUpdateSelection={this.handleUpdateSelection}
              minCharacters={3}
              disabledSearch={this.state.disabledSearch}
            />
          </Grid.Column>
          <Grid.Column width={10}>
            <Segment>
              <Header>Assign item to patron</Header>
              <pre style={{ overflowX: 'auto' }}>{this.renderSelection()}</pre>
            </Segment>
          </Grid.Column>
        </Grid>
      </div>
    );
  };

  renderModalActions = () => {
    const { documentPid, itemPid, isLoading, data, hasError } = this.props;
    const showInitialView = !isLoading && isEmpty(data);
    const showSuccessView = !isLoading && !hasError && !isEmpty(data);

    const loanData = {
      metadata: {
        document_pid: documentPid,
        item_pid: itemPid,
      },
    };

    return (
      <Modal.Actions>
        {showInitialView && (
          <div>
            <Button color="red" onClick={() => this.close()}>
              <Icon name="remove" /> Cancel
            </Button>
            <Button
              toggle
              disabled={!this.state.currentSelection}
              color="green"
              onClick={() => {
                this.checkoutNewLoan(
                  itemPid,
                  loanData,
                  this.state.currentSelection.patronPid
                );
                this.setState({ currentSelection: null, disabledSearch: true });
              }}
            >
              <Icon name="checkmark" /> Checkout
            </Button>
          </div>
        )}
        {showSuccessView && (
          <div>
            <Button color="red" onClick={() => this.close()}>
              <Icon name="remove" /> Close
            </Button>
            <Button primary onClick={() => this.gotoDetailsPage(data.id)}>
              View loan
            </Button>
          </div>
        )}
      </Modal.Actions>
    );
  };

  render() {
    const { itemBarcode } = this.props;

    return (
      <Modal
        trigger={this.triggerButton}
        size="small"
        open={this.state.open}
        basic
      >
        <Header content={`Checkout item ${itemBarcode}`} />

        <p>
          You are about to checkout the item with barcode {itemBarcode}. Search
          for the patron below to assign to the loan:
        </p>

        <Modal.Content>{this.renderModalContent()}</Modal.Content>

        <Modal.Actions>{this.renderModalActions()}</Modal.Actions>
      </Modal>
    );
  }
}

CreateNewLoanModal.propTypes = {
  documentPid: PropTypes.string.isRequired,
  itemPid: PropTypes.string.isRequired,
  itemBarcode: PropTypes.string.isRequired,
  active: PropTypes.bool,
  data: PropTypes.object,
  hasError: PropTypes.bool,
  isLoading: PropTypes.bool,
  error: PropTypes.object,
  createNewLoanForItem: PropTypes.func.isRequired,
  onLoanCreatedCallback: PropTypes.func.isRequired,
  resetNewLoanState: PropTypes.func.isRequired,
};

CreateNewLoanModal.defaultPropTypes = {
  active: true,
};
