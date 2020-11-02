import React, { useState } from "react";
import { Link } from "react-router-dom";
import { postData } from "service/Common";
import $ from "jquery";
import { ToastMessage } from "service/ToastMessage";

const queryString = require("query-string");

function ResetPasswordPage(props) {
	const [passwordData, setPasswordData] = useState({ password: "", confirm_password: "" });
	const [loading, setLoading] = useState(false);

	const parsed = queryString.parse(props.location.search);

	const setRedirect = () => {
		props.history.push("/");
	};

	const submitHandler = (e) => {
		e.preventDefault();
		if ($("#resetPasswordForm").valid() && !loading) {
			setLoading(true);
			var req = { ...parsed, password: passwordData.password, confirm_password: passwordData.confirm_password };
			postData("/api/admin/reset_password", req)
				.then((response) => {
					setPasswordData({ password: "", confirm_password: "" });
					ToastMessage(response.data.message, "s");
					setLoading(false);
					setRedirect();
				})
				.catch((error) => {
					ToastMessage(error.data.error, "e");
					setLoading(false);
				});
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
										<img src="/admin/images/logo.svg" alt="logo img" />
									</div>
									<h4>Reset Password</h4>

									<form id="resetPasswordForm" className="pt-3">
										<div className="form-group">
											<input
												type="password"
												className="form-control form-control-lg"
												id="password"
												name="password"
												placeholder="New Password"
												onChange={(e) => setPasswordData({ ...passwordData, password: e.target.value })}
												value={passwordData.password || ""}
												data-rule-required={true}
												data-rule-strongpassword={true}
												maxLength={50}
											/>
										</div>
										<div className="form-group">
											<input
												type="password"
												className="form-control form-control-lg"
												id="confirm_password"
												name="confirm_password"
												placeholder="Confirm Password"
												onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
												value={passwordData.confirm_password || ""}
												data-rule-required={true}
												data-rule-equalto={"#password"}
											/>
										</div>
										<div className="mt-3">
											<button
												className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn"
												onClick={submitHandler}
												disabled={loading ? "disabled" : ""}
											>
												{loading ? <span>Loading...</span> : "Reset Password"}{" "}
											</button>
										</div>
										<div className="my-2 d-flex justify-content-between align-items-center">
											<div className="form-check">
												<Link to={"/admin/forgot_password"} className="auth-link text-black">
													Forgot Password
												</Link>
											</div>
											<Link to={"/"} className="auth-link text-black">
												Login
											</Link>
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

export default ResetPasswordPage;
