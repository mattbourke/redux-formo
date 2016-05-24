import React from 'react';
import createConnectedField from './createConnectedField';

class Field extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.connectedComponent = this.createConnectedComponent();
    this.connectedComponentInstance = null;
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.name !== nextProps.name) {
      this.connectedComponent = this.createConnectedComponent();
    }
  }

  createConnectedComponent() {

    const props = this.props;
    const context = this.context.formo;

    return createConnectedField({
      getState: context.getState,
      form: context.name,
      field: props.name,
      filter: context.filter,
      validate: context.validate,
      defaultValue: context.defaults[props.name]
    });

  }

  getConnectedComponentInstance() {
    return this.connectedComponentInstance.getWrappedInstance(); //FIXME: this is a bit gross :(
  }

  filter() {
    this.getConnectedComponentInstance().filter();
  }

  validate() {
    this.getConnectedComponentInstance().validate();
  }

  render() {

    //console.log(`Field.render(${this.props.name})`);

    return React.createElement(this.connectedComponent, {
      ...this.props,
      ref: instance => this.connectedComponentInstance = instance
    });

  }

}

Field.contextTypes = {
  formo: React.PropTypes.object.isRequired
};

Field.propTypes = {
  name: React.PropTypes.string.isRequired
};

Field.defaultProps = {
};

export default Field;
