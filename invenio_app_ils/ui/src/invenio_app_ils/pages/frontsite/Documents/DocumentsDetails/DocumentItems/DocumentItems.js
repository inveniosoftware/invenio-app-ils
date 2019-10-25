import React, {Component} from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import {
  Accordion, Checkbox, Divider,
  Grid, Header,
  Label,
  List,
  Menu,
  Segment
} from "semantic-ui-react";
import {
  getDisplayVal,
  invenioConfig
} from "../../../../../common/config/invenioConfig";

class DocumentItem extends Component {

  render() {
    const {item} = this.props;
    return <List.Item key={item.pid}>
      <List.Icon name={'barcode'} size={'large'} verticalAlign={'middle'}/>
      <List.Content>
        <Grid columns={3}>
          <Grid.Column width={5}>
            <List.Header>{item.barcode}</List.Header>
            <List.Description>
              <label>Shelf</label> {item.shelf} <br/>
              <label>Location</label> {item.internal_location.name}
            </List.Description>
          </Grid.Column>

          <Grid.Column width={5}>
            <label>Status</label>{' '}
            {invenioConfig.items.canCirculateStates.includes(item.status) &&
            !item.circulation ? <span className={'success'}>On shelf</span> :
              (
              invenioConfig.items.canCirculateStates.includes(item.status) &&
              item.circulation ? <span className={'danger'}> On loan </span>:
              getDisplayVal('items.statuses', item.status).text)
            }
          </Grid.Column>

          <Grid.Column width={6}>
            <List.Description>

              <label>Medium</label>{' '}
              {getDisplayVal(
                'items.mediums', item.medium).text}<br/>

              <label>Restrictions</label>{' '}
              {item.circulation_restriction ?
              getDisplayVal(
                'items.circulationRestrictions',
                item.circulation_restriction
              ).text : 'None'}

            </List.Description>
          </Grid.Column>
        </Grid>
      </List.Content>
    </List.Item>
  }
}

DocumentItem.propTypes = {
  item: PropTypes.object.isRequired,
};

export default class DocumentItems extends Component {

  constructor(props) {
    super(props);

    if (props.documentDetails.metadata.items) {
      const onShelf = props.documentDetails.metadata.items.on_shelf;
      if (!isEmpty(onShelf)) {
        const library = Object.keys(onShelf)[0];
        this.state = {
          activeLibrary: library,
          activeInternalLocation: null,
        };
      } else {
        this.state = {
          activeLibrary: null,
          activeInternalLocation: null
        }
      }
    }
  }

  handleLocationClick = (e, titleProps) => {
    const {name} = titleProps;

    if (this.state.activeInternalLocation === name) {
      this.setState({activeInternalLocation: null});
    } else {
      this.setState({activeInternalLocation: name});
    }
  };

  handleClick = (e, titleProps) => {
    const {name} = titleProps;

    if (this.state.activeLibrary === name) {
      this.setState({activeLibrary: null});
    } else {
      this.setState({activeLibrary: name});
    }
  };

  renderInternalLocations = (internalLocations) => {
    const locations = [];
    const {activeInternalLocation} = this.state;

    if(Object.keys(internalLocations).length > 2) {
      Object.entries(internalLocations).forEach(
        ([internalLocationName, items]) => {
          if (internalLocationName !== 'total') {
            locations.push(
              <List.Item
                active={activeInternalLocation === internalLocationName}
                name={internalLocationName}
                onClick={this.handleLocationClick}
                key={internalLocationName}
              >
                {<Checkbox
                  radio
                  checked={activeInternalLocation === internalLocationName}/>}
                {' '}
                {internalLocationName}
              </List.Item>
            );
          }
        });
      return <List className={'document-items-location-filters'}
                   vertical>{locations}</List>;
    }
    return null;
  };

  renderLibraries = () => {
    const {activeLibrary} = this.state;
    const onShelf = this.props.documentDetails.metadata.items.on_shelf;
    const libraries = [];

    Object.entries(onShelf).forEach(
      ([locationName, locationObj]) => {
        libraries.push(
          <Menu.Item key={locationName}>
            <Accordion.Title
              active={activeLibrary === locationName}
              onClick={this.handleClick}
              name={locationName}
              content={
                <><Label>{onShelf[locationName]["total"]}</Label>

                  {locationName}</>
              }
            />
            {Object.keys(locationObj).length > 2 ?
              <Accordion.Content
              active={activeLibrary === locationName}
              content={this.renderInternalLocations(locationObj)}/>
              : null
            }
          </Menu.Item>
        );
      });

    return libraries;
  };

  renderItems = () => {
    const onShelf = this.props.documentDetails.metadata.items.on_shelf;
    if (!isEmpty(onShelf)) {
      let items = [];
      if (!this.state.activeLibrary) {
        return "Click on an available location to see the physical copies"
      } else if (this.state.activeLibrary &&
        !this.state.activeInternalLocation) {
        Object.entries(onShelf[this.state.activeLibrary]).forEach(
          ([internalLoc, locationItems]) => {
            if(internalLoc !=="total") {
              items = items.concat(locationItems);
            }
          }
        );
      } else {
        items = items.concat(
          onShelf[this.state.activeLibrary][this.state.activeInternalLocation]);
      }
      return (
          <>
            <Header as={'h5'}>
              Physical copies currently on shelf in {' '}
              {this.state.activeLibrary}
                {this.state.activeInternalLocation &&
                ` (${this.state.activeInternalLocation})`}
            </Header>
            <List divided>{items.slice(0, 20).map(item =>
              <DocumentItem key={item.pid} item={item}/>
            )}</List>
          </>)
    }
    return null;
  };

  render() {
    if (!isEmpty(this.props.documentDetails.metadata.items.on_shelf)) {
      return (
        <>
          <Divider horizontal>Where to find</Divider>
          <Grid stackable>
            <Grid.Column computer={4} tablet={4} mobile={16}>
              <Accordion as={Menu}
                         vertical
                         fluid
                         className={'document-items-location-menu'}
              >{this.renderLibraries()
              }
              </Accordion>
            </Grid.Column>
            <Grid.Column computer={12} tablet={12} mobile={16}>
              <Segment>
                {this.renderItems()}
              </Segment>
            </Grid.Column>
          </Grid>
        </>
      );
    }
    return (<>
        <Divider horizontal>Where to find</Divider>
        There is no available copies in the library.
        Check the availability later or contact us.
      </>
    );
  }
}

DocumentItems.propTypes = {
  documentDetails: PropTypes.object.isRequired,
};
