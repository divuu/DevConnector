import React, { Component } from "react";
import isEmpty from "../../validation/is-empty";

class ProfileHeader extends Component {
  render() {
    //const { profile } = this.props;
    return (
      <div className="row">
        <div className="col-md-12">
          <div className="card card-body bg-info text-white mb-3">
            <div className="row">
              <div className="col-4 col-md-3 m-auto">
                <img
                  className="rounded-circle"
                  src="https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=200"
                  alt=""
                />
              </div>
            </div>
            <div className="text-center">
              <h1 className="display-4 text-center">John Doe</h1>
              <p className="lead text-center">Developer at Microsoft</p>
              <p>Seattle, WA</p>
              <p>
                <a className="text-white p-2" href="#">
                  <i className="fas fa-globe fa-2x" />
                </a>
                <a className="text-white p-2" href="#">
                  <i className="fab fa-twitter fa-2x" />
                </a>
                <a className="text-white p-2" href="#">
                  <i className="fab fa-facebook fa-2x" />
                </a>
                <a className="text-white p-2" href="#">
                  <i className="fab fa-linkedin fa-2x" />
                </a>
                <a className="text-white p-2" href="#">
                  <i className="fab fa-instagram fa-2x" />
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ProfileHeader;
