import { h, render } from 'preact';

import components from './components';

import '../styles/app.scss';

// Check for tags in DOM to render preact components
const elems = document.querySelectorAll('[data-component]');

[...elems].forEach(elem => {
  const { dataset } = elem;

  const name = Object.keys(components).find(component => {
    return component === dataset.component;
  });

  if (name) {
    // Render preact component
    const WrapperComponent = components[name].default;

    const props = ('props' in dataset) ? JSON.parse(dataset.props) : {};

    render((<WrapperComponent {...props} />), elem);
  } else {
    throw new Error(`Could not find component with name "${dataset.component}"`);
  }
});
