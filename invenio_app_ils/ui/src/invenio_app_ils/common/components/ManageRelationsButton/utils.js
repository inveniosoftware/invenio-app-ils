import { invenioConfig } from '../../config';

export function formatPidTypeToName(pidType) {
  switch (pidType) {
    case 'docid':
      return 'Document';
    case 'serid':
      return 'Series';
    default:
      return pidType;
  }
}

export function getRelationTypeByName(name) {
  for (const type of invenioConfig.relationTypes) {
    if (type.name === name) {
      return type;
    }
  }
  throw Error(`No relation with name: ${name}`);
}
