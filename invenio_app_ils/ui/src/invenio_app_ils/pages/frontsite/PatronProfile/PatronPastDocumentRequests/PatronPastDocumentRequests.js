import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import _startCase from 'lodash/startCase';
import {
  Loader,
  Error,
  ResultsTable,
  Pagination,
} from '../../../../common/components';
import {dateFormatter} from '../../../../common/api/date';
import {FrontSiteRoutes} from '../../../../routes/urls';
import {invenioConfig} from '../../../../common/config';
import {Header, Item} from "semantic-ui-react";
import {ILSItemPlaceholder} from "../../../../common/components/ILSPlaceholder/ILSPlaceholder";

export default class PatronPastDocumentRequests extends Component {
  constructor(props) {
    super(props);
    this.fetchPatronDocumentRequests = this.props.fetchPatronDocumentRequests;
    this.patronPid = this.props.patronPid;
    this.state = {activePage: 1};
  }

  componentDidMount() {
    this.fetchPatronDocumentRequests(this.patronPid);
  }

  onPageChange = activePage => {
    this.fetchPatronDocumentRequests(this.patronPid, activePage);
    this.setState({activePage: activePage});
  };

  paginationComponent = () => {
    return (
      <Pagination
        currentPage={this.state.activePage}
        currentSize={invenioConfig.defaultResultsSize}
        loading={this.props.isLoading}
        totalResults={this.props.data.total}
        onPageChange={this.onPageChange}
      />
    );
  };

  libraryBookFormatter = ({row}) => {
    if (row.metadata.state !== 'ACCEPTED') {
      return _startCase(row.metadata.state.toLowerCase());
    }
    return (
      <Link to={FrontSiteRoutes.documentDetailsFor(row.metadata.document_pid)}>
        {row.metadata.document.title}
      </Link>
    );
  };

  renderLoader = (props) => {
    return (
      <>
        <Item.Group>
          <ILSItemPlaceholder fluid {...props}/>
        </Item.Group>
      </>
    )
  };

  render() {
    const {data, isLoading, error} = this.props;
    const columns = [
      {title: 'ID', field: 'metadata.pid'},
      {title: 'Title', field: 'metadata.title'},
      {
        title: 'Library Book',
        field: 'metadata.state',
        formatter: this.libraryBookFormatter,
      },
      {title: 'Created', field: 'created', formatter: dateFormatter},
    ];
    return (
      <><Header as={'h2'}
                content={"Past literature requests"}
                className={'highlight'}
                textAlign={'center'}
      />
        <Loader isLoading={isLoading} renderElement={this.renderLoader}>
          <Error error={error}>

            <ResultsTable
              data={data.hits}
              columns={columns}
              totalHitsCount={data.total}
              title={''}
              name={'past literature requests'}
              showMaxRows={invenioConfig.defaultResultsSize}
              paginationComponent={this.paginationComponent()}
              currentPage={this.state.activePage}
            />
          </Error>
        </Loader>
      </>
    );
  }
}

PatronPastDocumentRequests.propTypes = {
  patronPid: PropTypes.string.isRequired,
  fetchPatronDocumentRequests: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  showMaxRows: PropTypes.number,
};
