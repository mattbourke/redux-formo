import {FOCUS} from '../../src/redux/constants';
import * as actions from '../../src/redux/actions';
import bindActionCreators from '../../src/react/bindActionCreators';

describe('bindActionCreators()', () => {

  it('should have a bound function for each action', () => {

    const dispatch = sinon.spy();
    const boundActions = bindActionCreators('profile', dispatch);

    Object.keys(actions).forEach(action => {
      expect(boundActions[action]).to.be.a('function');
      expect(boundActions[action]).not.to.be.equal(action);
    });

  });

  it('should call dispatch() with the action bound to the form', () => {

    const dispatch = sinon.spy();
    const boundActions = bindActionCreators('profile', dispatch);

    boundActions.focus('firstName');

    expect(dispatch).to.be.calledWith({
      type: FOCUS,
      meta: {
        form: 'profile',
        field: 'firstName'
      }
    });

  });

});