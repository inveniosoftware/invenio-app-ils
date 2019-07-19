import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Pagination as Paginator } from 'semantic-ui-react';
import './Pagination.scss';

export class Pagination extends Component {
  constructor(props) {
    super(props);
    this.onPageChange = this.props.onPageChange;
    this.showFirstAndLastNav = false;
  }

  render() {
    const { totalResults, currentPage, currentSize } = this.props;
    const pages = Math.ceil(totalResults / currentSize);
    return (
      <div id="pagination">
        <Paginator
          firstItem={this.showFirstAndLastNav}
          lastItem={this.showFirstAndLastNav}
          activePage={currentPage}
          totalPages={pages}
          onPageChange={(event, { activePage }) =>
            this.onPageChange(activePage)
          }
        />
      </div>
    );
  }
}

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  currentSize: PropTypes.number,
  loading: PropTypes.bool,
  totalResults: PropTypes.number.isRequired,
};

Pagination.defaultProps = {
  renderElement: null,
};
