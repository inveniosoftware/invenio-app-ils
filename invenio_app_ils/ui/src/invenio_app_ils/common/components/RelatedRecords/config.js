import { invenioConfig } from '../../config';

export function getRelationTypes() {
  return invenioConfig.relationTypes;
}

export function getRelationTypeByName(name) {
  for (const type of getRelationTypes()) {
    if (type.name === name) {
      return type;
    }
  }
  throw Error(`No relation with name: ${name}`);
}

export function getRelationTypeById(id) {
  for (const type of getRelationTypes()) {
    if (type.id === id) {
      return type;
    }
  }
  throw Error(`No relation with id: ${id}`);
}

export function getIconByRelation(relation) {
  switch (relation.name) {
    case EditionRelation.name:
      return 'book';
    case LanguageRelation.name:
      return 'translate';
    default:
      return null;
  }
}

export const EditionRelation = getRelationTypeByName('edition');
export const LanguageRelation = getRelationTypeByName('language');
