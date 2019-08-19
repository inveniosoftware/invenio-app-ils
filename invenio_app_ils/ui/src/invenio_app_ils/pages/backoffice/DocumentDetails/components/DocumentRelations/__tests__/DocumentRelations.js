import React from 'react';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { shallow, mount } from 'enzyme';
import { DocumentRelations } from '../';
import { Settings } from 'luxon';
import { initialState } from '../state/reducer';
import { initialState as docDetailsState } from '../../../state/reducer';
import history from '../../../../../../history';
import { BackOfficeRoutes } from '../../../../../../routes/urls';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

Settings.defaultZoneName = 'utc';
jest.mock('../../../../../../common/config/invenioConfig');

describe('Document relations tests', () => {
  let component;
  afterEach(() => {
    if (component) {
      component.unmount();
    }
  });

  let store;
  beforeEach(() => {
    store = mockStore({
      documentDetails: docDetailsState,
      documentRelations: initialState,
    });
    store.clearActions();
  });

  it('should load the relations component', () => {
    const relations = {};
    const component = shallow(<DocumentRelations relations={relations} />);
    expect(component).toMatchSnapshot();
  });

  it('should render tabs', () => {
    const docState = docDetailsState;
    docState.isLoading = false;
    const state = initialState;
    state.isLoading = false;
    store = mockStore({
      documentDetails: docState,
      documentRelations: state,
      esSelector: { selections: [] },
    });

    component = mount(
      <Provider store={store}>
        <DocumentRelations />
      </Provider>
    );

    const buttons = component.find('ManageRelationsButton');
    expect(buttons).toHaveLength(5);
  });

  it('should render pagination for many rows', () => {
    const docState = docDetailsState;
    docState.isLoading = false;
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
    store = mockStore({
      documentDetails: docState,
      documentRelations: state,
      esSelector: { selections: [] },
    });

    component = mount(
      <Provider store={store}>
        <DocumentRelations showMaxRows={1} />
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

    const docState = docDetailsState;
    docState.isLoading = false;
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
    store = mockStore({
      documentDetails: docState,
      documentRelations: state,
      esSelector: { selections: [] },
    });

    component = mount(
      <Provider store={store}>
        <DocumentRelations showMaxRows={1} />
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
