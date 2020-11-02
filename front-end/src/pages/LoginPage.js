import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, resendVerificationEmail } from "actions/AuthActions";
import $ from "jquery";

function Login(props) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const UserReducers = useSelector((state) => state.UserReducers.AuthUserReducers);
	const {
		loading,
		loginSuccess,
		loginFailed,
		logingUserEMailIsNotVerified,
		loading_sending_email,
		verificationEMailSended,
		verificationEMailFailed,
	} = UserReducers;

	const dispatch = useDispatch();

	const submitHandler = (e) => {
		e.preventDefault();
		if ($("#login").valid() && !loading) {
			dispatch(login(email, password));
		}
	};

	const resendEmail = () => {
		dispatch(resendVerificationEmail(email, password));
	};

	const ifEmailIfNotVerified = (logingUserEMailIsNotVerified) => {
		if (logingUserEMailIsNotVerified) {
			return (
				<span>
					Your email is not verifed. Please click to{" "}
					<a href="javascript:void(0)" onClick={() => resendEmail()}>
						resend
					</a>{" "}
					if you did not get mail
				</span>
			);
		}
	};

	return (
		<>
			<main id="main">
				{/* <!-- ======= Breadcrumbs ======= --> */}
				<section id="breadcrumbs" className="breadcrumbs">
					<div className="container">
						<ol>
							<li>
								<a href="index.html">Home</a>
							</li>
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
								{ifEmailIfNotVerified(logingUserEMailIsNotVerified)}

								{loginFailed && <div className="error_show_notification">{loginFailed.error}</div>}

								{loading_sending_email && <div>Please wait...</div>}

								{verificationEMailFailed && <div className="error_show_notification">{verificationEMailFailed.error}</div>}

								{verificationEMailSended && <div className="success_show_notification">{verificationEMailSended.message}</div>}

								<form id="login">
									<div className="form-group required">
										<label className="control-label">Email</label>
										<input
											type="email"
											name="email"
											className="form-control cmn_input__2"
											placeholder="Email"
											onChange={(e) => setEmail(e.target.value)}
											value={email}
											required
										/>
									</div>
									<div className="form-group required">
										<label className="control-label">Password</label>
										<input
											type="password"
											name="password"
											className="form-control cmn_input__2"
											placeholder="Password"
											onChange={(e) => setPassword(e.target.value)}
											value={password}
											required
										/>
									</div>
									<div className="form-group ">
										<button className="btn w-100 log-btn bg_blue" onClick={submitHandler}>
											{loading ? <span>Loading...</span> : "SIGN IN"}
										</button>
									</div>
									<div className="form-group text-center ">
										<div className="my_login_btn">
											<span>
												<Link className="clr_blue" to="/register">
													Register
												</Link>
											</span>{" "}
											|
											<span>
												<Link to="/forgot_password" className="clr_blue">
													Forgot Password
												</Link>
											</span>
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

export default Login;
