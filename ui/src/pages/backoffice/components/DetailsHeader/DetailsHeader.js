import React from 'react';
import PropTypes from 'prop-types';
import { Container, Header, Icon, Segment } from 'semantic-ui-react';

export class DetailsHeader extends React.Component {
  renderHeader = () => {
    const { icon, subTitle, title } = this.props;
    return (
      <>
        <Segment basic floated="right" textAlign="right">
          {this.props.details}
        </Segment>
        <Header as="h1">
          {icon && <Icon name={icon} />}
          <Header.Content>
            {title}
            <Header.Subheader>{subTitle}</Header.Subheader>
          </Header.Content>
        </Header>
      </>
    );
  };

  render() {
    return (
      <Container className="details-header">
        {this.props.children ? this.props.children : this.renderHeader()}
      </Container>
    );
  }
}

DetailsHeader.propTypes = {
  details: PropTypes.any,
  icon: PropTypes.string,
  pid: PropTypes.string,
  recordType: PropTypes.string,
  subTitle: PropTypes.any,
  title: PropTypes.any,
};
