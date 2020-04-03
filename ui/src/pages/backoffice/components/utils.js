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
