import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { postData } from "service/Common";
import $ from 'jquery';
import { ToastMessage } from 'service/ToastMessage';

function ForgotPasswordPage(props) {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    

    const submitHandler = (e) => {
        e.preventDefault();
        if($('#forgotPasswordForm').valid() && !loading){
            setLoading(true);
            postData('/api/admin/forgot_password', {"email":email})
            .then((response)=>{
                console.log(response)
                ToastMessage(response.data.message,'s');
                setLoading(false);
                setEmail('');
            })
            .catch((error)=>{
                console.log(error)
                ToastMessage(error.data.error,'e');
                setLoading(false);
            })
            
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
                                        <img src="/admin/images/logo.svg" alt="admin_logo"/>
                                    </div>
                                    <h4>Forgot Password</h4>
                                    <form id="forgotPasswordForm" className="pt-3">
                                        <div className="form-group">
                                            <input type="email" className="form-control form-control-lg" id="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} value={email} data-rule-required={true} data-rule-email={true} />
                                        </div>
                                        <div className="mt-3">
                                            <button className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn" onClick={submitHandler} disabled={loading?'disabled':''}>{loading ? <span>Loading...</span> : "Forgot Password" } </button>
                                        </div>
                                        <div className="my-2 d-flex justify-content-between align-items-center">
                                            <div className="form-check">
                                            </div>
                                            <Link to={'/'} className="auth-link text-black">Login Back</Link>
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

export default ForgotPasswordPage;