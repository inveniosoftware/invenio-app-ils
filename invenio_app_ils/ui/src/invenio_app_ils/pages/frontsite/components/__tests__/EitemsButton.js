import React from 'react';
import renderer from 'react-test-renderer';
import { EitemsButton } from '../EitemsButton';

it('should render nothing when there are no eitems', () => {
  const eitems = [];
  const tree = renderer.create(<EitemsButton eitems={eitems} />).toJSON();
  expect(tree).toMatchSnapshot();
});

it('should render correctly when there is one eitem', () => {
  const eitems = [
    {
      description: 'Lorem Ipsum',
      eitem_pid: '145',
      internal_notes: 'Sed dolore',
      open_access: true,
    },
  ];
  const tree = renderer.create(<EitemsButton eitems={eitems} />).toJSON();
  expect(tree).toMatchSnapshot();
});

it('should render correctly when there are multiple eitems', () => {
  const eitems = [
    {
      description: 'Lorem Ipsum',
      eitem_pid: '145',
      internal_notes: 'Sed dolore',
      open_access: true,
    },
    {
      description: 'Est dolore',
      eitem_pid: '257',
      internal_notes: 'Voluptatem numquam',
      open_access: false,
    },
  ];

  const tree = renderer.create(<EitemsButton eitems={eitems} />).toJSON();
  expect(tree).toMatchSnapshot();
});
