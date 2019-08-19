import React from 'react';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { shallow, mount } from 'enzyme';
import { SeriesRelations } from '../';
import { Settings } from 'luxon';
import { initialState } from '../state/reducer';
import { initialState as seriesState } from '../../../state/reducer';
import history from '../../../../../../history';
import { BackOfficeRoutes } from '../../../../../../routes/urls';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

Settings.defaultZoneName = 'utc';
jest.mock('../../../../../../common/config/invenioConfig');

describe('Series relations tests', () => {
  let component;
  afterEach(() => {
    if (component) {
      component.unmount();
    }
  });

  let store;
  beforeEach(() => {
    store = mockStore({
      seriesDetails: seriesState,
      seriesRelations: initialState,
    });
    store.clearActions();
  });

  it('should load the relations component', () => {
    const relations = {};
    const component = shallow(<SeriesRelations relations={relations} />);
    expect(component).toMatchSnapshot();
  });

  it('should render tabs', () => {
    seriesState.isLoading = false;
    seriesState.data = {
      id: '1',
      metadata: {
        pid: '1',
        mode_of_issuance: 'MULTIPART_MONOGRAPH',
        relations: {},
      },
    };
    const state = initialState;
    state.isLoading = false;
    store = mockStore({
      seriesDetails: seriesState,
      seriesRelations: state,
      esSelector: { selections: [] },
    });

    component = mount(
      <Provider store={store}>
        <SeriesRelations />
      </Provider>
    );

    const buttons = component.find('ManageRelationsButton');
    expect(buttons).toHaveLength(2);
  });

  it('should render pagination for many rows', () => {
    const state = initialState;
    state.data = {
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
    state.isLoading = false;
    seriesState.isLoading = false;
    seriesState.data = {
      id: '1',
      metadata: {
        pid: '1',
        mode_of_issuance: 'MULTIPART_MONOGRAPH',
        relations: state.data,
      },
    };
    store = mockStore({
      seriesDetails: seriesState,
      seriesRelations: state,
      esSelector: { selections: [] },
    });

    component = mount(
      <Provider store={store}>
        <SeriesRelations showMaxRows={1} />
      </Provider>
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

    const state = initialState;
    const id = '2';
    state.data = {
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
    state.isLoading = false;
    seriesState.isLoading = false;
    seriesState.data = {
      id: '1',
      metadata: {
        pid: '1',
        mode_of_issuance: 'MULTIPART_MONOGRAPH',
        relations: state.data,
      },
    };
    store = mockStore({
      seriesDetails: seriesState,
      seriesRelations: state,
      esSelector: { selections: [] },
    });

    component = mount(
      <Provider store={store}>
        <SeriesRelations showMaxRows={1} />
      </Provider>
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
