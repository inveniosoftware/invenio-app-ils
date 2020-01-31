import React from 'react';
import { shallow, mount } from 'enzyme';
import DocumentRelations from '../DocumentRelations';
import { Settings } from 'luxon';
import { BackOfficeRoutes } from '@routes/urls';
import { Button } from 'semantic-ui-react';

jest.mock('react-router-dom');
jest.mock('@config/invenioConfig');
jest.mock('@components/ESSelector');
let mockViewDetails = jest.fn();
BackOfficeRoutes.documentDetailsFor = jest.fn(pid => `url/${pid}`);

Settings.defaultZoneName = 'utc';

jest.mock('../', () => {
  return {
    DocumentSeries: () => null,
    RelationRemover: () => null,
  };
});

describe('Document relations tests', () => {
  let component;
  afterEach(() => {
    mockViewDetails.mockClear();
    if (component) {
      component.unmount();
    }
  });

  it('should load the relations component', () => {
    const relations = {};
    const component = shallow(<DocumentRelations relations={relations} />);
    expect(component).toMatchSnapshot();
  });

  it('should render tabs', () => {
    const document = {};
    const relations = {};

    component = mount(
      <DocumentRelations
        document={document}
        relations={relations}
        isLoading={false}
      />
    );

    const buttons = component.find('ManageRelationsButton');
    expect(buttons).toHaveLength(1);
  });

  it('should render pagination for many rows', () => {
    const document = {};
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
      <DocumentRelations
        document={document}
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
});
