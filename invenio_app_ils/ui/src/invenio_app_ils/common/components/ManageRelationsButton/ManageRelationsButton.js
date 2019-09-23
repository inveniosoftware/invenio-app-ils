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
      <Button
        disabled={!props.enabled}
        className="edit-related"
        labelPosition={'left'}
      >
        <Icon name={'edit'} />
        {props.editButtonLabel ? props.editButtonLabel : 'Edit relation'}
      </Button>
    }
    {...props}
  />
);

ManageRelationsButton.propTypes = {
  config: PropTypes.object.isRequired,
  enabled: PropTypes.bool.isRequired,
  onRemoveSelection: PropTypes.func.isRequired,
  Selector: PropTypes.func.isRequired,
  SelectorModal: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
};

ManageRelationsButton.defaultProps = {
  enabled: false,
};
