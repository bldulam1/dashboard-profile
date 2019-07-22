import React from 'react';

export default function useToggle(initialState = false) {
  const [state, setState] = React.useState(initialState);
  const toggle = () => {
    setState(!state);
  }
  return [state, toggle];
}
