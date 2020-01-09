import React from 'react';
import { shallow } from 'enzyme';
import DocumentRequestMetadata from '../DocumentRequestMetadata';

const data = {
  metadata: {
    state: 'PENDING',
    patron_pid: 1,
    patron: { name: 'Name' },
  },
};

describe('DocumentRequestMetadata tests', () => {
  let component;
  afterEach(() => {
    if (component) {
      component.unmount();
    }
  });

  it('should render DocumentRequestMetadata component', () => {
    component = shallow(
      <DocumentRequestMetadata
        documentRequestDetails={data}
        rejectRequest={() => {}}
      />
    );
    expect(component).toMatchSnapshot();
  });

  it('should have enabled create document button', () => {
    component = shallow(
      <DocumentRequestMetadata
        documentRequestDetails={data}
        rejectRequest={() => {}}
      />
    );
    const button = component.find('[name="create-doc-from-doc-request"]');
    expect(button).toHaveLength(1);
    expect(button.prop('disabled')).toBe(false);
  });

  it('should have disabled create document button when state is not PENDING', () => {
    data.metadata.state = 'REJECTED';
    component = shallow(
      <DocumentRequestMetadata
        documentRequestDetails={data}
        rejectRequest={() => {}}
      />
    );
    const button = component.find('[name="create-doc-from-doc-request"]');
    expect(button).toHaveLength(1);
    expect(button.prop('disabled')).toBe(true);
  });

  it('should have disabled create document button when it has document', () => {
    data.metadata.document = { document_pid: 1 };
    component = shallow(
      <DocumentRequestMetadata
        documentRequestDetails={data}
        rejectRequest={() => {}}
      />
    );
    const button = component.find('[name="create-doc-from-doc-request"]');
    expect(button).toHaveLength(1);
    expect(button.prop('disabled')).toBe(true);
  });
});
