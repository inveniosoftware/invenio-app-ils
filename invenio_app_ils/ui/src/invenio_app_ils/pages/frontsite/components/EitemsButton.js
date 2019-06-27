import React, { Component } from 'react';

import { Button, Dropdown } from 'semantic-ui-react';
import { truncate } from 'lodash/string';

export class EitemsButton extends Component {
  constructor(props) {
    super(props);
    this.eitems = props.eitems;
  }

  prepareOptions(eitems) {
    return eitems.map(eitem => ({
      key: eitem.eitem_pid,
      text: truncate(eitem.description, { length: 40 }),
      value: eitem.eitem_pid,
    }));
  }

  render() {
    switch (this.eitems.length) {
      case 0:
        return null;
      case 1:
        return (
          <Button positive size="small" color="green" content="Access eBook" />
        );
      default:
        const eitemOptions = this.prepareOptions(this.eitems);
        return (
          <Dropdown
            text={`${this.eitems.length} eBooks`}
            options={eitemOptions}
            className="button positive"
            simple
            item
          />
        );
    }
  }
}
