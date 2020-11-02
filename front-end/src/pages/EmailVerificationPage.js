import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { postData } from "service/Common";
const queryString = require('query-string');

function EmailVerificationPage(props) {
    const [loading, setLoading] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const parsed = queryString.parse(props.location.search);

    const ValidateRequest = (query_url) => {
        resetMessage()
        setLoading(true);

        postData(query_url, {}, { without_base_url: true, method: "get" }).then((response) => {
            var data = response.data;
            setSuccess(<div className="success_show_notification text-center pb-3" >{data.message} </div>);
            setLoading(false);
        }).catch((error) => {
            setError(<div className="error_show_notification text-center pb-3" >{error.data.error} </div>);
            setLoading(false);
        })
    };

    React.useEffect(() => {
        ValidateRequest(parsed.queryURL);
    }, []);

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
                            <li>Login</li>
                        </ol>
                        <h2>Login</h2>
                    </div>
                </section>
                {/* <!-- End Breadcrumbs --> */}

                <section className="login_Sec">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-md-7 col-lg-4">
                                {loading && <span>Please Wait we are validating your request...</span>}
                                {error && <span>{error}</span>}
                                {success && <span>{success}</span>}

                                <div className="form-group text-center ">
                                    <div className="my_login_btn">
                                        <span>
                                            <Link className="clr_blue" to="/login">
                                                Login
												</Link>
                                        </span>{" "}
											|
											<span>
                                            <Link to="/register" className="clr_blue">
                                                Register
												</Link>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            {/* <!-- End #main --> */}
        </>
    );
}

export default EmailVerificationPage;