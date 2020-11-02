import React, { useState } from "react";
import { postData } from "service/Common";
import $ from "jquery";
import { ToastMessage } from "service/ToastMessage";

function AdminRegistration(props) {
	const [firstname, setFirstname] = useState("");
	const [lastname, setLastname] = useState("");
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [password, setPassword] = useState("");
	//const [accountType, setAccountType] = useState("");
	//const [organisationName, setOrganisationName] = useState("");
	const [loading, setLoading] = useState("");

	const submitHandler = (e) => {
		e.preventDefault();

		$("#register_admin").validate();

		if ($("#register_admin").valid() && !loading) {
			setLoading(true);
			var req = { firstname, lastname, email, password, phone };
			postData("/api/admin/save_user", req)
				.then((response) => {
					var data = response.data;
					ToastMessage(data.message, "s");
					setLoading(false);
					resetForm();
				})
				.catch((error) => {
					ToastMessage(error.data.error, "e");
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
		//setAccountType("");
		//setOrganisationName("");
	};

	return (
		<>
			<div className="content-wrapper">
				<div className="page-header">
					<h3 className="page-title"> Create Admin </h3>
					{/* <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="#">Tables</a></li>
                            <li className="breadcrumb-item active" aria-current="page">Basic tables</li>
                        </ol>
                    </nav> */}
				</div>

				<div className="row justify-content-center">
					<div className="col-lg-6 grid-margin stretch-card">
						<div className="card">
							<div className="card-body">
								<form id="register_admin" method="post">
									<div className="form-group">
										<label htmlFor="firstname">First Name</label>
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
									<div className="form-group">
										<label htmlFor="lastname">Last Name</label>
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
									<div className="form-group">
										<label htmlFor="email">Email</label>
										<input
											type="email"
											className="form-control cmn_input__2"
											placeholder="Email"
											name="email"
											onChange={(e) => setEmail(e.target.value)}
											value={email || ""}
											required
											data-rule-email={true}
											autoComplete="none"
										/>
									</div>
									<div className="form-group">
										<label htmlFor="phone">Phone</label>
										<input
											type="text"
											className="form-control cmn_input__2"
											placeholder="Phone"
											name="phone"
											onChange={(e) => setPhone(e.target.value)}
											value={phone || ""}
											required
											data-rule-phonenumber={true}
											autoComplete="none"
										/>
									</div>
									<div className="form-group">
										<label htmlFor="password">Password</label>
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
										<button className="btn w-100 log-btn bg_blue" onClick={submitHandler} disabled={loading ? "disabled" : ""}>
											{loading ? <span>Loading...</span> : "Save"}
										</button>
									</div>
								</form>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default AdminRegistration;
