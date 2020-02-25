import { EmailLink } from '@components';
import { invenioConfig } from '@config';
import { MetadataTable } from '@pages/backoffice/components';
import { BackOfficeRoutes } from '@routes/urls';
import _get from 'lodash/get';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  Divider,
  Grid,
  Header,
  Icon,
  Label,
  Message,
  Segment,
} from 'semantic-ui-react';

class ItemStatusMessageOnLoan extends Component {
  render() {
    const { circulation } = this.props;

    const patron = [
      {
        name: (
          <>
            <Icon name="user" /> Patron{' '}
          </>
        ),
        value: (
          <>
            <Link to={BackOfficeRoutes.patronDetailsFor(circulation.patron.id)}>
              {circulation.patron.name}
            </Link>{' '}
            <EmailLink
              email={circulation.patron.email}
              asButton
              size="mini"
              basic
              labelPosition="left"
              className="ml-10"
            />
          </>
        ),
      },
      {
        name: 'Loan',
        value: (
          <Link
            to={BackOfficeRoutes.loanDetailsFor(circulation.loan_pid)}
            target={'_blank'}
          >
            #{circulation.loan_pid}
          </Link>
        ),
      },
    ];

    const loan = [
      {
        name: 'Loan period',
        value: `${circulation.start_date} - ${circulation.end_date}`,
      },
      { name: 'Extensions', value: circulation.extension_count },
    ];

    return (
      <>
        <Divider horizontal> Loan</Divider>
        <Grid columns={2}>
          <Grid.Column width={8}>
            <MetadataTable labelWidth={5} rows={patron} />
          </Grid.Column>
          <Grid.Column width={8}>
            <MetadataTable labelWidth={5} rows={loan} />
          </Grid.Column>
        </Grid>
      </>
    );
  }
}

class ItemStatusMessageNotOnLoan extends Component {
  render() {
    const { status } = this.props;

    const canCirculate = invenioConfig.items.canCirculateStatuses.includes(
      status
    );
    let title,
      content,
      success = false,
      warning = false;
    if (canCirculate) {
      success = true;
      title = 'Physical copy on shelf';
      content = 'This physical copy is currently available for loan';
    } else {
      warning = true;
      const forReferenceOnly = invenioConfig.items.referenceStatuses.includes(
        status
      );
      title = forReferenceOnly
        ? 'Physical copy for reference only'
        : 'Physical copy not available';
      content = 'It is not possible to loan this copy.';
    }
    const cmpMessage = (
      <Message success={success} warning={warning} icon>
        <Icon name="info circle" />
        <Message.Content>
          <Message.Header>{title}</Message.Header>
          {content}
        </Message.Content>
      </Message>
    );
    return (
      <>
        <Divider horizontal>Status</Divider>
        {cmpMessage}
      </>
    );
  }
}

export default class ItemCirculation extends Component {
  hasActiveLoan = circulationState => {
    return (
      circulationState &&
      invenioConfig.circulation.loanActiveStates.includes(circulationState)
    );
  };

  statusLabel = circulationState => {
    return (
      this.hasActiveLoan(circulationState) && (
        <Label color="purple">ON LOAN</Label>
      )
    );
  };

  render() {
    const { metadata } = this.props.data;
    const circulationState = _get(metadata, 'circulation.state');
    const cmpItemStatusLabel = this.statusLabel(circulationState);
    const cmpItemStatusMessage = this.hasActiveLoan(circulationState) ? (
      <ItemStatusMessageOnLoan circulation={metadata.circulation} />
    ) : (
      <ItemStatusMessageNotOnLoan status={metadata.status} />
    );

    return (
      <>
        <Header as="h3" attached="top">
          Circulation {cmpItemStatusLabel}
          <Label basic color="black" size="small">
            <Icon name="hourglass half" />
            {metadata.circulation_restriction}
          </Label>{' '}
        </Header>
        <Segment attached className="bo-metadata-segment" id="circulation">
          <Grid columns={5} verticalAlign="middle">
            <Grid.Column width={5}>
              <Header size="small">
                <Icon name="map pin" />
                <Header.Content>
                  {metadata.shelf}
                  <Header.Subheader>shelf</Header.Subheader>
                </Header.Content>
              </Header>
            </Grid.Column>
            <Grid.Column width={1}>
              <Icon size="large" name="long arrow alternate right" />
            </Grid.Column>
            <Grid.Column width={4}>
              <Header
                as={Link}
                to={BackOfficeRoutes.locationsList}
                size="small"
              >
                <Icon name="university" />

                <Header.Content>
                  {metadata.internal_location.name}
                  <Header.Subheader>Internal location</Header.Subheader>
                </Header.Content>
              </Header>
            </Grid.Column>
            <Grid.Column width={1}>
              <Icon size="large" name="long arrow alternate right" />
            </Grid.Column>
            <Grid.Column>
              <Header
                as={Link}
                to={BackOfficeRoutes.locationsList}
                size="small"
              >
                <Icon name="map" />
                <Header.Content>
                  {metadata.internal_location.location.name}
                  <Header.Subheader>Location</Header.Subheader>
                </Header.Content>
              </Header>
            </Grid.Column>
          </Grid>
          {cmpItemStatusMessage}
        </Segment>
      </>
    );
  }
}
