import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { postData } from "service/Common";
import $ from "jquery";

function RegisterPage(props) {
	const [firstname, setFirstname] = useState("");
	const [lastname, setLastname] = useState("");
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [password, setPassword] = useState("");
	const [accountType, setAccountType] = useState("");
	const [organisationName, setOrganisationName] = useState("");
	const [loading, setLoading] = useState("");
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	const submitHandler = (e) => {
		e.preventDefault();

		$("#register").validate();

		if ($("#register").valid() && !loading) {
			resetMessage();
			setLoading(true);
			var req = { firstname, lastname, email, password, phone, accountType, organisationName };
			postData("/api/register", req)
				.then((response) => {
					var data = response.data;
					setSuccess(data.message);
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
		setFirstname("");
		setLastname("");
		setEmail("");
		setPassword("");
		setPhone("");
		setAccountType("");
		setOrganisationName("");
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
								<a href="/">Home</a>
							</li>
							<li>Register</li>
						</ol>
						<h2>Register</h2>
					</div>
				</section>
				{/* <!-- End Breadcrumbs --> */}

				<section className="login_Sec">
					<div className="container">
						<div className="row justify-content-center">
							<div className="col-md-7 col-lg-4">
								{error && <div className="error_show_notification">{error}</div>}
								{success && <div className="success_show_notification">{success}</div>}

								<form id="register" method="post">
									<div className="form-group required">
										<label className="control-label">First Name</label>
										<input
											type="text"
											className="form-control cmn_input__2"
											placeholder="First Name"
											name="fistname"
											onChange={(e) => setFirstname(e.target.value)}
											value={firstname || ""}
											required
										/>
									</div>
									<div className="form-group required">
										<label className="control-label">Last Name</label>
										<input
											type="text"
											className="form-control cmn_input__2"
											placeholder="Last Name"
											name="lastname"
											onChange={(e) => setLastname(e.target.value)}
											value={lastname || ""}
											required
										/>
									</div>

									<div className="form-group required">
										<label htmlFor="account_type" className="control-label">
											Account Type
										</label>
										<select
											name="account_type"
											id="account_type"
											className="form-control cmn_input__2"
											onChange={(e) => setAccountType(e.target.value)}
											required
										>
											<option value="">Select</option>
											<option value="1">Individual</option>
											<option value="2">Organisation</option>
										</select>
										<p>
											<small>
												<em>If Organisation, use official email id.</em>
											</small>
										</p>
									</div>

									{accountType == 2 ? (
										<div className="form-group required">
											<label className="control-label">Organisation Name</label>
											<input
												type="text"
												className="form-control cmn_input__2"
												placeholder="Organisation Name"
												name="organisation_name"
												onChange={(e) => setOrganisationName(e.target.value)}
												value={organisationName || ""}
												required
											/>
										</div>
									) : (
										""
									)}

									<div className="form-group required">
										<label className="control-label">Email</label>
										<input
											type="email"
											className="form-control cmn_input__2"
											placeholder="Email"
											name="email"
											onChange={(e) => setEmail(e.target.value)}
											value={email || ""}
											required
											autoComplete="none"
										/>
									</div>
									<div className="form-group required">
										<label className="control-label">Phone</label>
										<input
											type="text"
											className="form-control cmn_input__2"
											placeholder="Phone"
											name="phone"
											onChange={(e) => setPhone(e.target.value)}
											value={phone || ""}
											required
											autoComplete="none"
										/>
									</div>
									<div className="form-group required">
										<label className="control-label">Password</label>
										<input
											type="password"
											className="form-control cmn_input__2"
											placeholder="Password"
											name="password"
											onChange={(e) => setPassword(e.target.value)}
											value={password || ""}
											required
											data-rule-strongpassword="true"
											autoComplete="new-password"
										/>
									</div>

									<div className="form-group">
										<button className="btn w-100 log-btn bg_blue" onClick={submitHandler}>
											{loading ? <span>Loading...</span> : "SIGN UP"}
										</button>
									</div>
									<div className="form-group text-center ">
										<span>
											<Link className="clr_blue" to="/login">
												Login
											</Link>
										</span>{" "}
										|
										<span>
											<Link to="/forgot_password" className="clr_blue">
												Forgot Password
											</Link>
										</span>
									</div>
								</form>
							</div>
						</div>
					</div>
				</section>
			</main>
		</>
	);
}

export default RegisterPage;
