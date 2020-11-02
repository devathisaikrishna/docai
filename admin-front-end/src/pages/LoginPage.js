import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "actions/AuthActions";
import $ from "jquery";

function Login(props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const AuthReducers = useSelector((state) => state.AdminReducers.AuthReducers);
    const { loading } = AuthReducers;

    const dispatch = useDispatch();

    const submitHandler = (e) => {
        e.preventDefault();
        if($('#loginForm').valid()){
            dispatch(login(email, password));
        }
    };

    return (
        <>
            <div className="container-scroller">
                <div className="container-fluid page-body-wrapper full-page-wrapper">
                    <div className="content-wrapper d-flex align-items-center auth">
                        <div className="row flex-grow">
                            <div className="col-lg-4 mx-auto">
                                <div className="auth-form-light text-left p-5">
                                    <div className="brand-logo">
                                        <img src="/admin/images/logo.svg" />
                                    </div>
                                    <h4>Hello! let's get started</h4>
                                    <h6 className="font-weight-light">Sign in to continue.</h6>
                                    
                                    <form id="loginForm" className="pt-3">
                                        <div className="form-group">
                                            <input type="email" className="form-control form-control-lg" id="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} value={email} data-rule-required={true} data-rule-email={true} />
                                        </div>
                                        <div className="form-group">
                                            <input type="password" className="form-control form-control-lg" id="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} value={password} required />
                                        </div>
                                        <div className="mt-3">
                                            <button className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn" onClick={submitHandler} disabled={loading?'disabled':''}>{loading ? <span>Loading...</span> : "SIGN IN" } </button>
                                        </div>
                                        <div className="my-2 d-flex justify-content-between align-items-center">
                                            <div className="form-check">
                                                <label className="form-check-label text-muted">
                                                    <input type="checkbox" className="form-check-input" /> Keep me signed in </label>
                                            </div>
                                            <Link to={'/admin/forgot_password'} className="auth-link text-black">Forgot password?</Link>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Login;