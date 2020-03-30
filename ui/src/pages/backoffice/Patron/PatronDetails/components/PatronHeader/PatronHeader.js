import { CopyButton } from '@components';
import { DetailsHeader, PatronIcon } from '@pages/backoffice/components';
import React, { Component } from 'react';
import { Header } from 'semantic-ui-react';

export default class PatronHeader extends Component {
  render() {
    const { data } = this.props;
    const recordInfo = (
      <>
        <label className="muted">Patron</label> {data.metadata.pid}{' '}
        <CopyButton text={data.metadata.id} />
        <br />
      </>
    );

    return (
      <DetailsHeader
        title={
          <>
            <Header.Subheader>{data.metadata.email}</Header.Subheader>
            {data.metadata.name}
          </>
        }
        subTitle={''}
        pid={data.metadata.id}
        icon={<PatronIcon />}
        recordType="Patron"
        recordInfo={recordInfo}
      />
    );
  }
}
