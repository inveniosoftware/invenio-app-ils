import React from 'react';
import { mount, shallow } from 'enzyme';
import documentsTestData from '@testData/documents.json';
import seriesTestData from '@testData/series.json';
import { SeriesLiteratureResultsList } from './SeriesLiteratureResultsList';
import { BrowserRouter } from 'react-router-dom';
import { FrontSiteRoutes } from '@routes/urls';

const series = seriesTestData[0];

const results = {
  total: 4,
  hits: [
    { metadata: documentsTestData[0] },
    { metadata: documentsTestData[1] },
    { metadata: seriesTestData[1] },
    { metadata: seriesTestData[2] },
  ],
};

describe('SeriesLiteratureResultsList tests', () => {
  let component;
  afterEach(() => {
    if (component) {
      component.unmount();
    }
  });

  it('should load the SeriesLiteratureResultsList component', () => {
    const component = shallow(
      <SeriesLiteratureResultsList metadata={series} results={results.hits} />
    );
    expect(component).toMatchSnapshot();
  });

  it('should link to document and series details', () => {
    component = mount(
      <BrowserRouter>
        <SeriesLiteratureResultsList metadata={series} results={results.hits} />
      </BrowserRouter>
    );

    // Add serial relation to hits
    let volume = 1;
    for (const hit of results.hits) {
      hit.metadata.relations = {
        serial: {
          pid: series.pid,
          pid_type: 'serid',
          relation_type: 'serial',
          title: `Test title vol. ${volume}`,
          volume: volume + 's',
        },
      };
      volume++;
    }

    const documentEntries = component.find('DocumentListEntry');
    const seriesEntries = component.find('SeriesListEntry');
    expect(documentEntries).toHaveLength(2);
    expect(seriesEntries).toHaveLength(2);

    const firstDocId = results.hits[0].metadata.pid;
    const documentLink = documentEntries
      .filterWhere(element => element.prop('data-test') === firstDocId)
      .find('Link')
      .first();

    const firstSeriesId = results.hits[2].metadata.pid;
    const seriesLink = seriesEntries
      .filterWhere(element => element.prop('data-test') === firstSeriesId)
      .find('Link')
      .first();

    expect(documentLink.props().to).toEqual(
      FrontSiteRoutes.documentDetailsFor(firstDocId)
    );
    expect(seriesLink.props().to).toEqual(
      FrontSiteRoutes.seriesDetailsFor(firstSeriesId)
    );
  });
});
