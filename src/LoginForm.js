import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import $ from 'jquery'

import './styles.css'

import { clearUserMessages, login } from 'ovirt-ui-components'

import logo from './ovirt_top_right_logo.png'
import brand from './ovirt_top_logo.png'

const Logo = () => {
  return (
    <span id='badge'>
      <img src={logo} alt='oVirt logo' />
    </span>
  )
}

const Brand = () => {
  return (
    <div className='col-sm-12'>
      <div id='brand'>
        <img src={brand} alt='oVirt Basic User Portal' />
      </div>
    </div>
  )
}

const WelcomeText = () => {
  return (
    <div className="col-sm-5 col-md-6 col-lg-7 details">
      <p>
        <strong>Welcome to oVirt Basic User Portal</strong>
      </p>
    </div>
  )
}

const LoginFailed = () => {
  return (
    <div className='form-group'>
      <div className='col-sm-10 col-md-10'>
        <div className={'login-failed-text'}>
          Login failed
        </div>
      </div>
    </div>
  )
}
LoginFailed.propTypes = {}

class LoginForm extends Component {
  componentWillMount () {
    $('html').addClass('login-pf')
  }

  componentWillUnmount () {
    $('html').removeClass('login-pf')
  }

  // TODO: user-defined REST API URL
  // TODO: dropdown for Profile

  isLoginFailed (userMessages) {
    return userMessages.get('records').find((msg) => (msg.type === 'access_denied' || msg.type === 'no_access')) !== undefined
  }

  render () {
    const { userMessages, onLogin } = this.props

    let username, password
    const onUserChanged = (e) => {username = e.target.value}
    const onPwdChanged = (e) => {password = e.target.value}
    const handleSubmit = (e) => {
      e.preventDefault();
      onLogin({username, password})
    }

    const loginFailed = this.isLoginFailed(userMessages) ? (<LoginFailed />) : ''

    return (<div>
      <Logo />

      <div className='container'>
        <div className='row'>
          <Brand />

          <div className='col-sm-7 col-md-6 col-lg-5 login'>
            <form className='form-horizontal' role='form' onSubmit={handleSubmit}>
              <div className='form-group'>
                <label htmlFor='inputUsername' className='col-sm-2 col-md-2 control-label'>Username</label>
                <div className='col-sm-10 col-md-10'>
                  <input type='text' className='form-control' id='inputUsername' placeholder='' tabIndex='1' onChange={onUserChanged} />
                </div>
              </div>

              <div className='form-group'>
                <label htmlFor='inputPassword' className='col-sm-2 col-md-2 control-label'>Password</label>
                <div className='col-sm-10 col-md-10'>
                  <input type='password' className='form-control' id='inputPassword' placeholder='' tabIndex='2' onChange={onPwdChanged} />
                </div>
              </div>

              <div className='form-group'>
                <div className='col-xs-8 col-sm-offset-2 col-sm-6 col-md-offset-2 col-md-6' />

                <div className='col-xs-4 col-sm-4 col-md-4 submit'>
                  <button type='submit' className='btn btn-primary btn-lg' tabIndex='4'>Log In</button>
                </div>
              </div>

              {loginFailed}
            </form>
          </div>

          <WelcomeText />
        </div>
      </div>
    </div>)
  }
}
LoginForm.propTypes = {
  onLogin: PropTypes.func.isRequired,
}

export default connect(
  (state) => ({
    userMessages: state.userMessages
  }),
  (dispatch) => ({
    onLogin: ({username, password}) => {
      dispatch(clearUserMessages())
      dispatch(login({username, password}))
    }
  })
)(LoginForm)