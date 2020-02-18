import { RelationSerial } from '@pages/backoffice/components/Relations/RelationSerial';
import SeriesMetadataTabs from './components/SeriesMetadata/SeriesMetadataTabs';
import { SeriesSiblings } from './components/SeriesRelations/';
import { SeriesActionMenu } from './';
import { SeriesHeader } from './SeriesHeader';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Accordion,
  Container,
  Divider,
  Grid,
  Ref,
  Segment,
  Sticky,
} from 'semantic-ui-react';
import { Loader, Error } from '@components';
import { SeriesDocuments, SeriesMultipartMonographs } from './components';
import history from '@history';
import isEmpty from 'lodash/isEmpty';

export default class SeriesDetails extends Component {
  constructor(props) {
    super(props);
    this.menuRef = React.createRef();
    this.headerRef = React.createRef();

    this.anchors = {
      top: React.createRef(),
      documents: React.createRef(),
      monographs: React.createRef(),
      relations: React.createRef(),
    };
  }

  componentDidMount() {
    this.unlisten = history.listen(loc => {
      if (loc.state && loc.state.pid && loc.state.type === 'Series') {
        this.props.fetchSeriesDetails(loc.state.pid);
      }
    });
    this.props.fetchSeriesDetails(this.props.match.params.seriesPid);
  }

  componentWillUnmount() {
    this.unlisten();
  }

  seriesPanels = () => {
    const { data } = this.props;
    const panes = [
      {
        key: 'series-documents',
        title: 'Literature in this series',
        content: (
          <Accordion.Content>
            <div ref={this.anchors.documents} id="series-documents">
              <SeriesDocuments />
            </div>
          </Accordion.Content>
        ),
      },
      {
        key: 'series-monographs',
        title: 'Multipart monographs',
        content: (
          <Accordion.Content>
            <div ref={this.anchors.documents} id="series-monographs">
              <SeriesMultipartMonographs />
            </div>
          </Accordion.Content>
        ),
      },
      {
        key: 'series-serials',
        title: 'Serials',
        content: (
          <Accordion.Content>
            <div ref={this.anchors.monographs} id="series-serials">
              <Segment>
                <RelationSerial recordDetails={data} />
              </Segment>
            </div>
          </Accordion.Content>
        ),
      },
      {
        key: 'series-relations',
        title: 'Related',
        content: (
          <Accordion.Content>
            <div ref={this.anchors.relations} id="series-relations">
              <SeriesSiblings />
            </div>
          </Accordion.Content>
        ),
      },
    ];
    const isSerial =
      !isEmpty(this.props.data) &&
      this.props.data.metadata.mode_of_issuance === 'SERIAL';
    if (isSerial) panes.splice(2, 1);
    if (!isSerial) panes.splice(1, 1);
    return panes;
  };

  render() {
    const { isLoading, error, data, relations } = this.props;
    return (
      <div ref={this.headerRef}>
        <Container fluid>
          <Loader isLoading={isLoading}>
            <Error error={error}>
              <Sticky context={this.headerRef} className="solid-background">
                <Container fluid className="spaced">
                  <SeriesHeader data={data} />
                </Container>
                <Divider />
              </Sticky>
              <Container fluid>
                <Ref innerRef={this.menuRef}>
                  <Grid columns={2}>
                    <Grid.Column width={13}>
                      <div ref={this.anchors.top} id="series-documents">
                        <SeriesMetadataTabs series={data} />
                      </div>
                      <Accordion
                        fluid
                        styled
                        className="highlighted"
                        panels={this.seriesPanels()}
                        exclusive={false}
                        defaultActiveIndex={[0, 1, 2]}
                      />
                    </Grid.Column>
                    <Grid.Column width={3}>
                      <Sticky context={this.menuRef} offset={150}>
                        <SeriesActionMenu
                          anchors={this.anchors}
                          series={data}
                          relations={relations}
                        />
                      </Sticky>
                    </Grid.Column>
                  </Grid>
                </Ref>
              </Container>
            </Error>
          </Loader>
        </Container>
      </div>
    );
  }
}

SeriesDetails.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  data: PropTypes.object,
  relations: PropTypes.object,
  error: PropTypes.object,
};
