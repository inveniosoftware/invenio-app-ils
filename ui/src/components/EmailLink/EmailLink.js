import React from 'react';

export const EmailLink = ({ bcc, body, cc, children, email, subject }) => {
  const params = [];
  if (bcc) params.push(`bcc=${bcc}`);
  if (body) params.push(`body=${body}`);
  if (cc) params.push(`cc=${cc}`);
  if (subject) params.push(`subject=${subject}`);

  const url = params.length > 0 ? email + '?' : email;

  return <a href={`mailto:${url}`}>{children || email}</a>;
};
