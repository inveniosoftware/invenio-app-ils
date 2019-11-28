import React from 'react';
import { shallow, mount } from 'enzyme';
import { BrowserRouter } from 'react-router-dom';
import LoanList from '../LoanList';
import * as testData from '@testData/loans.json';


jest.mock('../../../components/OverdueLoanSendMailModal', () => {
  return {
    OverdueLoanSendMailModal: () => null,
  };
});

describe('LoanList tests', () => {
  let component;
  afterEach(() => {
    if (component) {
      component.unmount();
    }
  });


  const document = {
    metadata: {
      ...testData[0],
      document: { title: 'TEST' },
    },
  };

  it('should load the LoanList component', () => {
    const component = shallow(<LoanList hits={[document]} />);
    expect(component).toMatchSnapshot();
  });

  it('should show empty message', () => {
    const component = shallow(<LoanList hits={[]} />);
    expect(component).toMatchSnapshot();
    // const resultRows = component
    //   .find('TableRow')
    //   .filterWhere(element => element.prop('data-test') === firstResult.id);
    // expect(resultRows).toHaveLength(1);
  });

  it('should load the LoanList component', () => {
    const component = mount(
      <BrowserRouter>
        <LoanList hits={[document]} />
      </BrowserRouter>
    );
    expect(component).toMatchSnapshot();
  });
});
