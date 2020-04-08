import { withCancel } from '@api/utils';
import { Error, Loader } from '@components';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Card, Divider, Header, Icon } from 'semantic-ui-react';
import { BookCard } from '../../components';

export default class BookGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      data: { hits: [] },
      error: {},
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  componentWillUnmount() {
    this.cancellableFetchStats && this.cancellableFetchStats.cancel();
  }

  fetchData = async () => {
    this.setState({ isLoading: true });

    this.cancellableFetchStats = withCancel(
      this.props.fetchDataMethod(this.props.fetchDataQuery)
    );
    try {
      const response = await this.cancellableFetchStats.promise;
      this.setState({ data: response.data, isLoading: false });
    } catch (error) {
      if (error !== 'UNMOUNTED') {
        this.setState({ error: error, isLoading: false });
      }
    }
  };

  renderCards() {
    const { data } = this.state;
    if (!data) return null;
    return data.hits.map(book => {
      return <BookCard key={book.metadata.pid} data={book} />;
    });
  }

  render() {
    const { title, viewAllUrl, headerClass } = this.props;
    const { isLoading, error } = this.state;
    return (
      <div>
        <Header as={'h2'} className={headerClass}>
          {title}
        </Header>
        <Header.Subheader>
          <Link to={viewAllUrl}>
            VIEW ALL <Icon name={'caret right'} />
          </Link>
        </Header.Subheader>
        <Divider hidden />
        <Loader isLoading={isLoading}>
          <Error error={error}>
            <Card.Group stackable doubling centered itemsPerRow={5}>
              {this.renderCards()}
            </Card.Group>
          </Error>
        </Loader>
      </div>
    );
  }
}

BookGroup.propTypes = {
  fetchDataMethod: PropTypes.func.isRequired,
  fetchDataQuery: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  viewAllUrl: PropTypes.string.isRequired,
  headerClass: PropTypes.string,
};
