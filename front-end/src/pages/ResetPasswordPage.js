import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { postData } from "service/Common";
import $ from "jquery";
const queryString = require("query-string");

function ResetPasswordPage(props) {
	const [password, setPassword] = useState("");
	const [confirm_password, setConfirm_password] = useState("");
	const [loading, setLoading] = useState("");
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	const parsed = queryString.parse(props.location.search);

	const submitHandler = (e) => {
		e.preventDefault();

		$("#reset-password").validate();

		if ($("#reset-password").valid() && !loading) {
			resetMessage();
			setLoading(true);
			var req = { ...parsed, password };
			postData("/api/user/reset_password", req)
				.then((response) => {
					var data = response.data;
					setSuccess(<div className="success_show_notification text-center pb-3">{data.message}</div>);
					setLoading(false);
					resetForm();
					setTimeout(() => {
						resetMessage();
					}, 10000);
				})
				.catch((error) => {
					setError(error.data.error);
					setLoading(false);
				});
		}
	};

	const resetForm = () => {
		setPassword("password");
		setConfirm_password("confirm_password");
	};

	const resetMessage = () => {
		setSuccess("");
		setError("");
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
							<li>Reset Password</li>
						</ol>
						<h2>Reset Password</h2>
					</div>
				</section>
				{/* <!-- End Breadcrumbs --> */}

				<section className="login_Sec">
					<div className="container">
						<div className="row justify-content-center">
							<div className="col-md-7 col-lg-4">
								{error && <div className="success_show_notification text-center pb-3">{error}</div>}
								{success && <div className="error_show_notification text-center pb-3">{success}</div>}

								<form id="reset-password">
									<div className="form-group required">
										<label className="control-label">Password</label>
										<input
											type="password"
											name="password"
											className="form-control cmn_input__2"
											placeholder="Password"
											onChange={(e) => setPassword(e.target.value)}
											value={password}
											autoComplete="new-password"
											required
											data-rule-strongpassword="true"
										/>
									</div>
									<div className="form-group required">
										<label className="control-label">Confirm Password</label>
										<input
											type="password"
											name="confirm_password"
											className="form-control cmn_input__2"
											placeholder="Confirm Password"
											onChange={(e) => setConfirm_password(e.target.value)}
											value={confirm_password}
											autoComplete="new-password"
											required
										/>
									</div>
									<div className="form-group">
										<button className="btn w-100 log-btn bg_blue" onClick={submitHandler}>
											{loading ? <span>Loading...</span> : "Reset Password"}
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
												<Link to="/login" className="clr_blue">
													Login
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

export default ResetPasswordPage;
