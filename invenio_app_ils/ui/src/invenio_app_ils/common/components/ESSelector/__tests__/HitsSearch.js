import React from 'react';
import { shallow, mount } from 'enzyme';
import { HitsSearch } from '../HitsSearch';

describe('HitsSearch tests', () => {
  let component;
  afterEach(() => {
    if (component) {
      component.unmount();
    }
  });

  it('should load the selector component', () => {
    const component = shallow(<HitsSearch delay={0} query={() => {}} />);
    expect(component).toMatchSnapshot();
  });

  it('should search when text input changes', done => {
    const mockedApi = query => {
      expect(query).toBe('test');
      done();
    };

    component = mount(<HitsSearch delay={0} query={mockedApi} />);
    component.find('input').simulate('change', {
      target: { value: 'test' },
    });
  });

  it('should return one result', done => {
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
      <HitsSearch query={api} delay={0} onResults={onResults} />
    );
    component.find('input').simulate('change', {
      target: { value: 'test' },
    });
  });

  it('should return one result', done => {
    const api = async query => {
      const response = {
        data: {
          hits: [
            {
              id: 1,
              keyword_pid: '1',
              metadata: {
                $schema:
                  'https://127.0.0.1:5000/schemas/keywords/keyword-v1.0.0.json',
                keyword_pid: '1',
                name: 'Dolorem',
                provenance: 'Quaerat',
              },
            },
          ],
        },
      };
      return await response;
    };

    const onResults = results => {
      expect(results.length).toBe(1);
      expect(results[0].title).toBe('Dolorem');
      done();
    };

    component = mount(
      <HitsSearch query={api} delay={0} onResults={onResults} />
    );
    component.find('input').simulate('change', {
      target: { value: 'test' },
    });
  });
});
