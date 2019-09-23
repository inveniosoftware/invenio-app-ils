import React from 'react';
import { shallow, mount } from 'enzyme';
import SeriesRelations from '../SeriesRelations';
import { Settings } from 'luxon';
import history from '../../../../../../history';
import { BackOfficeRoutes } from '../../../../../../routes/urls';

Settings.defaultZoneName = 'utc';
jest.mock('../../../../../../common/config/invenioConfig');
jest.mock('../../../../../../common/components/ESSelector');

describe('Series relations tests', () => {
  let component;
  afterEach(() => {
    if (component) {
      component.unmount();
    }
  });

  it('should load the relations component', () => {
    const relations = {};
    const component = shallow(<SeriesRelations relations={relations} />);
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
    const relations = {};

    component = mount(
      <SeriesRelations
        series={series}
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
        series={series}
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
        series={series}
        relations={relations}
        isLoading={false}
        showMaxRows={1}
      />
    );

    const button = component
      .find('TableRow')
      .filterWhere(element => element.prop('data-test') === id)
      .find('i');
    button.simulate('click');
    const expectedUrl = BackOfficeRoutes.documentDetailsFor(id);
    const expectedState = { pid: id, type: 'Document' };
    expect(mockedHistoryPush).toHaveBeenCalledWith(expectedUrl, expectedState);
  });
});
