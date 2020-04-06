import React, { Component } from 'react';
import { Icon } from 'semantic-ui-react';

export class DocumentIcon extends Component {
  render() {
    return <Icon {...this.props} name="book" />;
  }
}

export class SeriesIcon extends Component {
  render() {
    return <Icon name="clone outline" />;
  }
}

export class ItemIcon extends Component {
  render() {
    return <Icon name="barcode" />;
  }
}

export class EItemIcon extends Component {
  render() {
    return <Icon name="desktop" />;
  }
}

export class LoanIcon extends Component {
  render() {
    return <Icon name="bookmark outline" />;
  }
}

export class PatronIcon extends Component {
  render() {
    return <Icon name="user" />;
  }
}

export class AcquisitionOrderIcon extends Component {
  render() {
    return <Icon name="shopping cart" />;
  }
}

export class AcquisitionVendorIcon extends Component {
  render() {
    return <Icon name="industry" />;
  }
}

export class DocumentRequestIcon extends Component {
  render() {
    return <Icon name="comment outline" />;
  }
}

export class ILLBorrowingRequestIcon extends Component {
  render() {
    return <Icon name="sync alternate" />;
  }
}

export class ILLLibraryIcon extends Component {
  render() {
    return <Icon name="boxes" />;
  }
}
