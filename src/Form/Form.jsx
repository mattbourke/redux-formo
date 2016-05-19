import React from 'react';
import deepEqual from 'lodash.isequal';

class Form extends React.Component {

  constructor(...args) {
    super(...args);
    this.filter = this.filter.bind(this);
    this.validate = this.validate.bind(this);
    this.submit = this.submit.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  getChildContext() {
    return {
      formo: {
        getState: this.props.getState,
        name: this.props.name,
        filter: this.props.filterFn,
        validate: this.props.validateFn
      }
    };
  }

  componentWillUnmount() {
    if (this.props.destroyOnUnmount) {
      this.props.destroy();
    }
  }

  filter() {
    //FIXME: wrap this in an action creator
    return Promise.all(
      this.props.fields.map(name => this.props.filter(name))
    );
  }

  validate() {
    //FIXME: wrap this in an action creator
    return Promise.all(
      this.props.fields.map(name => this.props.validate(name))
    );
  }

  submit() {
    //FIXME: wrap this in an action creator
    return Promise.resolve()
      .then(() => this.filter())
      .then(() => this.validate())
      .then(() => {

        if (this.props.valid) {
          return this.props.submit();
        }

      })
    ;
  }

  handleSubmit(event) {
    if (event) {
      event.preventDefault();
    }
    this.submit();
  }

  render() {
    const {
      stateKey,
      name,
      destroyOnUnmount,
      filter,
      validate,
      submit,
      children,
      component: Component,
      ...otherProps
    } = this.props;

    const childProps = {


      //state
      ...otherProps,
      //TODO: calculate other state or move to reducer

      //functions
      filter: this.filter,
      validate: this.validate,
      submit: this.submit,

      //handlers
      onSubmit: this.handleSubmit

    };

    console.log('Form.render()');

    if (typeof Component === 'function') {
      return <Component {...childProps}/>;
    } else if (children) {
      return React.cloneElement(
        React.Children.only(children),
        childProps
      );
    } else {
      throw new Error('No component/children.');
    }

  }

}

Form.childContextTypes = {
  formo: React.PropTypes.object.isRequired
};

Form.propTypes = {

  getState: React.PropTypes.func.isRequired,
  name: React.PropTypes.string.isRequired,

  children: React.PropTypes.element,
  component: React.PropTypes.func,

  filter: React.PropTypes.func.isRequired,
  validate: React.PropTypes.func.isRequired,
  submit: React.PropTypes.func.isRequired,

  destroyOnUnmount: React.PropTypes.bool.isRequired

};

export default Form;