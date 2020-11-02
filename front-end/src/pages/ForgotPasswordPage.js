import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { postData } from "service/Common"
import $ from 'jquery';

function ForgotPasswordPage(props) {
  
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const submitHandler = (e) => {
        e.preventDefault();

        $("#forgot-password").validate();

        if ($("#forgot-password").valid() && !loading) {
            resetMessage()
            setLoading(true);
            var req = {email};
            postData("/api/user/forgot_password", req).then((response) => {
                var data = response.data;
                setSuccess(data.message);
                setLoading(false);
                resetForm();
                setTimeout(() => { resetMessage() }, 10000);
            }).catch((error) => {
                setError(error.data.error);
                setLoading(false);
            })
        }
    };

    const resetForm = () => {
        setEmail("")
    }

    const resetMessage = () => {
        setSuccess("");
        setError("");
    }

    return (
        <>
            <main id="main">
                {/* <!-- ======= Breadcrumbs ======= --> */}
                <section id="breadcrumbs" className="breadcrumbs">
                    <div className="container">

                        <ol>
                            <li><a href="index.html">Home</a></li>
                            <li>Forgot Password</li>
                        </ol>
                        <h2>Forgot Password</h2>

                    </div>
                </section>
                {/* <!-- End Breadcrumbs --> */}

                <section className="login_Sec">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-md-7 col-lg-4">
                                {error && <div>{error}</div>}
                                {success && <div>{success}</div>}

                                <form id="forgot-password">
                                    <div className="form-group required">
                                        <label className="control-label">Email</label>
                                        <input type="email" className="form-control cmn_input__2" placeholder="Email" onChange={(e) => setEmail(e.target.value)} value={email} data-rule-email={true} data-rule-required={true} />
                                    </div>
                                    <div className="form-group">
                                        <button className="btn w-100 log-btn bg_blue" onClick={submitHandler}>{loading ? <span>Loading...</span> : "FORGOT PASSWORD"}</button>
                                    </div>
                                    <div className="form-group text-center ">
                                    <div className="my_login_btn">

                                        <span><Link className="clr_blue" to="/register">Register</Link></span> |
                                        <span><Link to="/login" className="clr_blue">Login</Link></span>
                                    </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            {/* <!-- End #main --> */}
        </>
    );
}

export default ForgotPasswordPage;