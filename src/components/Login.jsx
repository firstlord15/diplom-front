import React from "react";
import "./css/Style.css";
import "./css/Login.css";

const Login = () => {
    return (
        <div className="Login">
            <div className="container">
                <div className="content br-25">
                    <div className="decoration-circle top-right"></div>
                    <div className="decoration-circle bottom-left"></div>

                    <form>
                        <div className="form-header">
                            <h2>Login</h2>
                        </div>

                        <div className="form-group">
                            <label for="exampleInputEmail1">Email address</label>
                            <input type="email" className="form-control" required placeholder="Enter email" />
                        </div>
                        <div className="form-group">
                            <label for="exampleInputPassword1">Password</label>
                            <input type="password" className="form-control" required placeholder="Password" />
                        </div>
                        <button type="submit" className="btn btn-primary">
                            Login
                        </button>

                        <div className="login-link">
                            New to Here? <a href="/register">Create an account</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
