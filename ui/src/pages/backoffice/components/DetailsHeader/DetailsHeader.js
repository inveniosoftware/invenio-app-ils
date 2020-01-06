import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Header } from 'semantic-ui-react';

export class DetailsHeader extends React.Component {
  render() {
    const { icon, subTitle, title } = this.props;
    return (
      <Grid columns={2}>
        <Grid.Column width={13}>
          <Header as="h1">
            {icon}
            <Header.Content>
              {title}
              <Header.Subheader>{subTitle}</Header.Subheader>
            </Header.Content>
          </Header>
          {this.props.children}
        </Grid.Column>
        <Grid.Column width={3} floated="right" textAlign="right">
          {this.props.recordInfo}
        </Grid.Column>
      </Grid>
    );
  }
}

DetailsHeader.propTypes = {
  icon: PropTypes.node,
  pid: PropTypes.string,
  recordType: PropTypes.string,
  subTitle: PropTypes.any,
  recordInfo: PropTypes.any,
  title: PropTypes.any,
};
