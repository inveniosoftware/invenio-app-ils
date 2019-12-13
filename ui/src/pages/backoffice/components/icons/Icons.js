import React, { Component } from 'react';
import {Icon} from "semantic-ui-react";

export class DocumentIcon extends Component{
  render() {
    return <Icon name="book"/>
  }
}

export class ItemIcon extends Component{
  render() {
    return <Icon name="barcode"/>
  }
}

export class EItemIcon extends Component{
  render() {
    return <Icon name="desktop"/>
  }
}


export class LoanIcon extends Component{
  render() {
    return <Icon name="bookmark outline"/>
  }
}
