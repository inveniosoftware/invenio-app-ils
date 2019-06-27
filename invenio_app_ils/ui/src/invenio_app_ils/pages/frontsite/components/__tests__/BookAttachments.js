import React from 'react';
import renderer from 'react-test-renderer';
import { BookAttachments } from '../BookAttachments';

it('should render nothing when the book does not contain attachments', () => {
  const documentData = {};
  const tree = renderer
    .create(
      <BookAttachments documentData={documentData} displayOption="desktop" />
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('should render correctly when there are no files', () => {
  const documentData = {
    files: ['file1', 'file2'],
  };
  const tree = renderer
    .create(
      <BookAttachments documentData={documentData} displayOption="desktop" />
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('should render correctly when there are no links', () => {
  const documentData = {
    links: ['link1', 'link2'],
  };
  const tree = renderer
    .create(
      <BookAttachments documentData={documentData} displayOption="desktop" />
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('should render correctly', () => {
  const documentData = {
    links: ['link1', 'link2'],
    files: ['file1', 'file2'],
  };
  const tree = renderer
    .create(
      <BookAttachments documentData={documentData} displayOption="desktop" />
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
