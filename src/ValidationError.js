import React from 'react';
import PropTypes from 'prop-types';

export default function ValidationError(props) {
  if(props.hasError) {
    return (
      <div className="error">{props.message}</div>
    );
  }

  return <></>
}

ValidationError.PropTypes = {
    hasError: PropTypes.bool.required,
    message: PropTypes.string.required
}