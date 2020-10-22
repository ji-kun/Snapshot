import React, { Component } from 'react';
import Identicon from 'identicon.js';
import photo from '../photo.png'
import './App.css'

class Navbar extends Component {

  render() {
    return (
      <nav className="navbar navigator">
          <img src={photo} width="30" height="30" className="d-inline-block align-top" alt="" />
          <h1 className="Snapshot">SNAPSHOT!</h1>
        <ul className="navbar-nav px-3">
          <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
            <small className="text-secondary">
              <small id="account">{this.props.account}</small>
            </small>
            { this.props.account
              ? <img
                className='ml-3'
                width='40'
                height='40'
                src={`data:image/png;base64,${new Identicon(this.props.account, 40).toString()}`}
              />
              : <span></span>
            }
          </li>
        </ul>
      </nav>
    );
  }
}

export default Navbar;