import { Pagination } from 'react-searchkit';
import React, { Component } from 'react';
import { Responsive } from 'semantic-ui-react';

export default class SearchPagination extends Component {
  render() {
    return (
      <>
        <Responsive minWidth={Responsive.onlyTablet.minWidth}>
          <Pagination />
        </Responsive>
        <Responsive {...Responsive.onlyMobile}>
          <Pagination
            options={{
              boundaryRangeCount: 0,
              siblingRangeCount: 0,
              showPrev: true,
              showNext: true,
            }}
          />
        </Responsive>
      </>
    );
  }
}
