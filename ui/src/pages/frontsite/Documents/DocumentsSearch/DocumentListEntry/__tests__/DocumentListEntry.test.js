import React from 'react';
import DocumentListEntry from '../DocumentListEntry';
import * as testData from '@testData/documents.json';
import { shallow } from 'enzyme';

it('should render correctly', () => {
  const data = {
    metadata: {
      ...testData[0],
      pid: '13',
      eitems: { hits: [], total: 0 },
      circulation: {
        has_items_for_loan: 0,
      },
    },
  };

  const component = shallow(<DocumentListEntry metadata={data.metadata} />);
  expect(component).toMatchSnapshot();
});
