import { fromISO, toShortDate } from '@api/date';
import { DatePicker } from '@components';
import { invenioConfig } from '@config';
import { getDisplayVal } from '@config/invenioConfig';
import { MetadataTable } from '@pages/backoffice/components';
import { LoanIcon } from '@pages/backoffice/components/icons';
import { BackOfficeRoutes } from '@routes/urls';
import _get from 'lodash/get';
import { DateTime } from 'luxon';
import { PropTypes } from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Divider,
  Form,
  Grid,
  Icon,
  Label,
  Message,
  Modal,
} from 'semantic-ui-react';

class CreateLoanButton extends React.Component {
  render() {
    const brwReq = this.props.brwReq;
    const isCompleted = invenioConfig.illBorrowingRequests.completedStatuses.includes(
      brwReq.status
    );
    if (isCompleted) {
      return null;
    }

    const hasRequestedStatus = brwReq.status === 'REQUESTED';
    const hasLoan = _get(brwReq, 'patron_loan.pid', false);

    let description =
      'Create a new loan for the patron when you have received the requested item.';
    let isEnabled = !this.props.isLoading;
    if (!hasRequestedStatus && !hasLoan) {
      description = `To create a new loan, change the borrowing request status to REQUESTED.`;
      isEnabled = false;
    } else if (!hasRequestedStatus && hasLoan) {
      description =
        'The borrowing request has already a loan. To create a new one, edit the request and remove the loan PID.';
      isEnabled = false;
    }

    return (
      <Message>
        <Message.Content>
          <Grid columns={2} verticalAlign={'middle'}>
            <Grid.Row>
              <Grid.Column width={10}>{description}</Grid.Column>
              <Grid.Column width={6} textAlign={'center'}>
                <Button
                  icon
                  loading={this.props.isLoading}
                  positive
                  size="small"
                  labelPosition="left"
                  onClick={this.props.onNewLoanClicked}
                  disabled={!isEnabled}
                >
                  <Icon name="plus" />
                  New loan
                </Button>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Message.Content>
      </Message>
    );
  }
}

CreateLoanButton.propTypes = {
  brwReq: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  onNewLoanClicked: PropTypes.func.isRequired,
};

class CreateLoan extends React.Component {
  constructor(props) {
    super(props);
    this.today = toShortDate(DateTime.local());
    this.state = {
      modalOpen: false,
      startDate: this.today,
      endDate: '',
    };
  }

  handleStartDateChange = value => {
    this.setState({ startDate: value });
  };

  handleEndDateChange = value => {
    this.setState({ endDate: value });
  };

  handleOpenModal = () => {
    this.setState({ modalOpen: true });
  };

  handleCloseModal = () => {
    this.setState({ modalOpen: false });
  };

  isSelectionValid = () => {
    return (
      this.state.startDate &&
      this.state.endDate &&
      fromISO(this.state.startDate) < fromISO(this.state.endDate)
    );
  };

  handleCreateLoan = () => {
    const startDate = fromISO(this.state.startDate);
    const endDate = fromISO(this.state.endDate);
    this.props.borrowingRequestPatronLoanCreate(
      this.props.brwReq.pid,
      startDate,
      endDate
    );
    this.handleCloseModal();
  };

  transformError = error => {
    return error.response.data.message;
  };

  render() {
    const { brwReq, isLoading, hasError, error } = this.props;
    return (
      <>
        <CreateLoanButton
          brwReq={brwReq}
          isLoading={isLoading}
          onNewLoanClicked={this.handleOpenModal}
        />

        {hasError && (
          <Message
            error
            header="Something went wrong"
            content={this.transformError(error)}
          />
        )}

        <Modal open={this.state.modalOpen}>
          <Modal.Header>Create a new loan</Modal.Header>
          <Modal.Content>
            Checkout the borrowed item for the patron {brwReq.patron.name}.
            Select the start and the end dates:
            <Divider hidden />
            <Form>
              <Form.Group>
                <Form.Field inline required>
                  <label>Start date</label>
                  <DatePicker
                    minDate={this.today}
                    defaultValue={this.today}
                    placeholder="Start date"
                    handleDateChange={value =>
                      this.handleStartDateChange(value)
                    }
                  />
                </Form.Field>
                <Form.Field inline required>
                  <label>End date</label>
                  <DatePicker
                    minDate={this.today}
                    defaultValue={this.endDate}
                    placeholder="End date"
                    handleDateChange={value => this.handleEndDateChange(value)}
                  />
                </Form.Field>
              </Form.Group>
              <Divider hidden />
              <i>
                The loan end date should not be after the borrowing request end
                date.
              </i>
            </Form>
          </Modal.Content>
          <Modal.Actions key={'modalActions'}>
            <Button onClick={this.handleCloseModal}>Cancel</Button>
            <Button
              positive
              disabled={!this.isSelectionValid()}
              icon="checkmark"
              labelPosition="left"
              content="Create"
              onClick={this.handleCreateLoan}
            />
          </Modal.Actions>
        </Modal>
      </>
    );
  }
}

CreateLoan.propTypes = {
  brwReq: PropTypes.object.isRequired,
  /* REDUX */
  error: PropTypes.object,
  isLoading: PropTypes.bool.isRequired,
  hasError: PropTypes.bool.isRequired,
  borrowingRequestPatronLoanCreate: PropTypes.func.isRequired,
};

export default class BorrowingRequestPatronLoan extends React.Component {
  renderLoanLink(loanPid) {
    return loanPid ? (
      <Link to={BackOfficeRoutes.loanDetailsFor(loanPid)}>
        <LoanIcon /> {loanPid}
      </Link>
    ) : (
      '-'
    );
  }

  render() {
    const { brwReq } = this.props;
    const loanPid = _get(brwReq, 'patron_loan.pid');
    const loanStartDate = _get(brwReq, 'patron_loan.loan.start_date');
    const loanEndDate = _get(brwReq, 'patron_loan.loan.end_date');
    const loanStatus = _get(brwReq, 'patron_loan.loan.state');

    const leftTable = [
      {
        name: 'Loan',
        value: this.renderLoanLink(loanPid),
      },
      {
        name: 'Status',
        value: loanStatus ? (
          <Label basic color="blue" size="tiny">
            {getDisplayVal('circulation.statuses', loanStatus)}
          </Label>
        ) : (
          '-'
        ),
      },
    ];
    const rightTable = [
      {
        name: 'Start date',
        value: loanStartDate ? toShortDate(loanStartDate) : '-',
      },
      {
        name: 'End date',
        value: loanEndDate ? toShortDate(loanEndDate) : '-',
      },
    ];
    return (
      <>
        <Grid columns={2}>
          <Grid.Row>
            <Grid.Column>
              <MetadataTable labelWidth={8} rows={leftTable} />
            </Grid.Column>
            <Grid.Column>
              <MetadataTable labelWidth={8} rows={rightTable} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <CreateLoan {...this.props} />
      </>
    );
  }
}

BorrowingRequestPatronLoan.propTypes = {
  brwReq: PropTypes.object.isRequired,
  /* REDUX */
  error: PropTypes.object,
  isLoading: PropTypes.bool.isRequired,
  hasError: PropTypes.bool.isRequired,
  borrowingRequestPatronLoanCreate: PropTypes.func.isRequired,
};
