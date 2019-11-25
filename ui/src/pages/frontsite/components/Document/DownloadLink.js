import React from 'react';
import { file as fileApi, eitem as eitemApi } from '@api';

export const DownloadLink = ({ children, content, eitem, filename }) => (
  <a
    href={fileApi.downloadURL(eitem.bucket_id, filename)}
    onClick={() => eitemApi.fileDownloaded(eitem.pid, filename)}
  >
    {content || children || filename}
  </a>
);
