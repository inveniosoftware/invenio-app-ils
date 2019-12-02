import React from 'react';
import { shallow, mount } from 'enzyme';
import { HitsSearch } from '../HitsSearch';
import { serializeLocation } from '../serializer';

jest.mock('../ESSelectorLoanRequest', () => {
  return {
    ESSelectorLoanRequest: () => null,
  };
});

describe('HitsSearch tests', () => {
  const serializer = serializeLocation;

  let component;
  afterEach(() => {
    if (component) {
      component.unmount();
    }
  });

  it('should load the selector component', () => {
    const component = shallow(
      <HitsSearch delay={0} query={() => {}} serializer={serializer} />
    );
    expect(component).toMatchSnapshot();
  });

  it('should search when text input changes', done => {
    const mockedApi = query => {
      expect(query).toBe('test');
      done();
    };

    component = mount(
      <HitsSearch delay={0} query={mockedApi} serializer={serializer} />
    );
    component.find('input').simulate('change', {
      target: { value: 'test' },
    });
  });

  it('should return no result', done => {
    const api = async query => {
      const response = {
        data: {
          hits: [],
        },
      };
      return await response;
    };

    const onResults = results => {
      expect(results.length).toBe(0);
      done();
    };

    component = mount(
      <HitsSearch
        query={api}
        delay={0}
        onResults={onResults}
        serializer={serializer}
      />
    );
    component.find('input').simulate('change', {
      target: { value: 'test' },
    });
  });

  it('should return one result', done => {
    const api = async () => {
      const response = {
        data: {
          hits: [
            {
              id: 1,
              pid: '1',
              metadata: {
                $schema:
                  'https://127.0.0.1:5000/schemas/locations/location-v1.0.0.json',
                pid: '1',
                name: 'Central Library',
                address: 'Rue de Meyrin',
                email: 'library@cern.ch',
              },
            },
          ],
        },
      };
      return await response;
    };

    const onResults = results => {
      expect(results.length).toBe(1);
      expect(results[0].title).toBe('Central Library');
      done();
    };

    component = mount(
      <HitsSearch
        query={api}
        delay={0}
        onResults={onResults}
        serializer={serializer}
      />
    );
    component.find('input').simulate('change', {
      target: { value: 'test' },
    });
  });
});
