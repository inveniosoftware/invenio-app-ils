import React from 'react';
import { shallow, mount } from 'enzyme';
import DocumentStats from '../DocumentStats';

const mockFetchDocumentStats = jest.fn();

const mockDocumentStatsResponse = {
  hits: [
    { id: 1, metadata: { extension_count: 2 } },
    { id: 2, metadata: { extension_count: 2 } },
  ],
  total: 2,
};

const mockDocument = {
  id: 1,
  pid: 'doc1',
  metadata: {
    pid: 'doc1',
    loan_count: 1,
    circulation: {
      past_loans_count: 2,
      can_circulate_items_count: 1,
    },
  },
};

describe('DocumentStats tests', () => {
  let component;
  beforeEach(() => {
    mockFetchDocumentStats.mockClear();
  });

  afterEach(() => {
    if (component) {
      component.unmount();
    }
  });

  it('should load the component', () => {
    const component = shallow(
      <DocumentStats
        documentDetails={mockDocument}
        documentStats={mockDocumentStatsResponse}
        fetchDocumentStats={mockFetchDocumentStats}
      />
    );
    expect(component).toMatchSnapshot();
  });

  it('should fetch documents stats on mount', () => {
    component = mount(
      <DocumentStats
        documentDetails={mockDocument}
        documentStats={mockDocumentStatsResponse}
        fetchDocumentStats={mockFetchDocumentStats}
      />
    );
    expect(mockFetchDocumentStats).toHaveBeenCalled();
  });

  it('should render document stats and check the average', () => {
    component = mount(
      <DocumentStats
        documentDetails={mockDocument}
        documentStats={mockDocumentStatsResponse}
        fetchDocumentStats={mockFetchDocumentStats}
      />
    );

    const cells = component.find('TableBody').find('TableCell');
    expect(cells).toHaveLength(3);

    const avgCell = component
      .find('TableBody')
      .find('TableCell')
      .filterWhere(element => element.prop('data-test') === 'cell-average');

    expect(parseFloat(avgCell.text())).toEqual(
      mockDocument.metadata.circulation.past_loans_count /
        mockDocument.metadata.circulation.can_circulate_items_count
    );
  });
});
