import React from "react";
import "./css/Style.css";
import "./css/Register.css";

const Register = () => {
    return (
        <div className="Register">
            <div className="container">
                <div className="content">
                    {/* Декоративные элементы */}
                    <div className="decoration-circle top-right"></div>
                    <div className="decoration-circle bottom-left"></div>

                    <form>
                        <div className="form-header">
                            <h2>Create Account</h2>
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email address</label>
                            <input type="email" className="form-control" id="email" placeholder="Enter your email" />
                            <small className="form-text">We'll never share your email with anyone else.</small>
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input type="password" className="form-control" id="password" placeholder="Create a password" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input type="password" className="form-control" id="confirmPassword" placeholder="Confirm your password" />
                        </div>

                        <button type="submit" className="btn btn-primary">
                            Register
                        </button>

                        <div className="login-link">
                            Already have an account? <a href="/login">Log in</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
