import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon } from 'semantic-ui-react';

export const ManageRelationsButton = ({ config, SelectorModal, ...props }) => (
  <SelectorModal
    multiple
    selectorComponent={props.Selector}
    size="small"
    title={config.modal.title}
    content={config.modal.content}
    recordTypes={config.recordTypes}
    extraFields={config.modal.extraFields}
    config={config}
    trigger={
      props.triggerButton || (
        <Button
          disabled={!props.enabled}
          className="edit-related"
          icon
          labelPosition="left"
          positive={props.positive}
        >
          {props.icon || <Icon name="edit" />}
          {props.editButtonLabel ? props.editButtonLabel : 'Edit relation'}
        </Button>
      )
    }
    {...props}
  />
);

ManageRelationsButton.propTypes = {
  config: PropTypes.object.isRequired,
  enabled: PropTypes.bool.isRequired,
  Selector: PropTypes.func.isRequired,
  SelectorModal: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onRemoveSelection: PropTypes.func,
  icon: PropTypes.node,
  triggerButton: PropTypes.node,
};

ManageRelationsButton.defaultProps = {
  enabled: false,
};
