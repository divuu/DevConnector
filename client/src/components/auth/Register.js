import React, { Component } from "react";
import PropTypes from "prop-types";
// import axios from "axios";
import { withRouter } from "react-router-dom";
//import classnames from "classnames";
import { connect } from "react-redux";
import { registerUser } from "../../actions/authActions";
import TextFieldGroup from "../common/TextFieldGroup";

class Register extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      email: "",
      password: "",
      password2: "",
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();
    const newUser = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2
    };

    this.props.registerUser(newUser, this.props.history);
  }

  render() {
    const errors = this.state.errors;

    return (
      <div className="register">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Sign Up</h1>
              <p className="lead text-center">
                Create your DevConnector account
              </p>
              <form onSubmit={this.onSubmit}>
                {/* this is a text field component used for creatig text box */}
                <TextFieldGroup
                  placeholder="Name"
                  name="name"
                  type="text" //{by default its propety is type is text}
                  error={errors.name}
                  value={this.state.name}
                  onChange={this.onChange}
                />

                <TextFieldGroup
                  placeholder="Email Address"
                  name="email"
                  type="email"
                  error={errors.email}
                  value={this.state.email}
                  onChange={this.onChange}
                  info="This site uses Gravatar so if you want a profile image, use a Gravatar email"
                />

                <TextFieldGroup
                  placeholder="Password"
                  name="password"
                  type="password"
                  error={errors.password}
                  value={this.state.password}
                  onChange={this.onChange}
                />

                <TextFieldGroup
                  placeholder="Confirm Password"
                  name="password2"
                  type="password"
                  error={errors.password2}
                  value={this.state.password2}
                  onChange={this.onChange}
                />

                <input type="submit" className="btn btn-info btn-block mt-4" />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { registerUser }
)(withRouter(Register));
