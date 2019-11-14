import React from 'react';
import { shallow, mount } from 'enzyme';
import { SeriesRelationsTabPanel as SeriesRelations } from '../SeriesRelations';
import { Settings } from 'luxon';
import history from '@history';
import { BackOfficeRoutes } from '@routes/urls';
import { Button } from 'semantic-ui-react';

Settings.defaultZoneName = 'utc';
jest.mock('react-router-dom');
jest.mock('@config/invenioConfig');
jest.mock('@components/ESSelector');
BackOfficeRoutes.documentDetailsFor = jest.fn(pid => `url/${pid}`);
let mockViewDetails = jest.fn();

describe('Series relations tests', () => {
  let component;
  afterEach(() => {
    mockViewDetails.mockClear();
    if (component) {
      component.unmount();
    }
  });

  it('should load the relations component', () => {
    const series = {
      id: '1',
      metadata: {
        pid: '1',
        mode_of_issuance: 'MULTIPART_MONOGRAPH',
        relations: {},
      },
    };
    const relations = {};
    const component = shallow(
      <SeriesRelations seriesDetails={series} relations={relations} />
    );
    expect(component).toMatchSnapshot();
  });

  it('should render tabs', () => {
    const series = {
      id: '1',
      metadata: {
        pid: '1',
        mode_of_issuance: 'MULTIPART_MONOGRAPH',
        relations: {},
      },
    };
    const relations = {
      edition: [
        {
          pid: '2',
          pid_type: 'docid',
        },
        {
          pid: '3',
          pid_type: 'docid',
        },
      ],
    };

    component = mount(
      <SeriesRelations
        seriesDetails={series}
        relations={relations}
        isLoading={false}
      />
    );

    const buttons = component.find('ManageRelationsButton');
    expect(buttons).toHaveLength(1);
  });

  it('should render pagination for many rows', () => {
    const series = {
      id: '1',
      metadata: {
        pid: '1',
        mode_of_issuance: 'MULTIPART_MONOGRAPH',
      },
    };
    const relations = {
      edition: [
        {
          pid: '2',
          pid_type: 'docid',
        },
        {
          pid: '3',
          pid_type: 'docid',
        },
      ],
    };

    component = mount(
      <SeriesRelations
        seriesDetails={series}
        relations={relations}
        isLoading={false}
        showMaxRows={1}
      />
    );

    const editionTable = component
      .find('ResultsTable')
      .filterWhere(el => el.prop('name') === 'related editions');
    expect(editionTable.contains('Pagination'));
    const pagination = editionTable.find('Pagination').first();
    expect(pagination.prop('currentSize')).toEqual(1);
    expect(pagination.prop('totalResults')).toEqual(2);
  });

  it('should go to record details when clicking on a row', () => {
    const mockedHistoryPush = jest.fn();
    history.push = mockedHistoryPush;

    const series = {
      id: '1',
      metadata: {
        pid: '1',
        mode_of_issuance: 'MULTIPART_MONOGRAPH',
      },
    };
    const id = '2';
    const relations = {
      edition: [
        {
          pid: id,
          pid_type: 'docid',
        },
        {
          pid: '3',
          pid_type: 'docid',
        },
      ],
    };

    component = mount(
      <SeriesRelations
        seriesDetails={series}
        relations={relations}
        isLoading={false}
        showMaxRows={1}
      />
    );

    component.instance().viewDetails = jest.fn(() => (
      <Button onClick={mockViewDetails}></Button>
    ));
    component.instance().forceUpdate();

    component
      .find('TableCell')
      .filterWhere(element => element.prop('data-test') === `0-${id}`)
      .find('Button')
      .simulate('click');
    expect(mockViewDetails).toHaveBeenCalled();
  });
});
