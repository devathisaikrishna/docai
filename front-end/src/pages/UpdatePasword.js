import React, { useEffect, useState } from "react";
import { postData } from "service/Common";
import $ from "jquery";
import { Alert, Container, Card, CardBody, CardTitle } from 'reactstrap';

function UpdatePasword(props) {
	const [oldPassword, setoldPassword] = useState("");
	const [newPassword, setnewPassword] = useState("");
	const [confirmPassword, setconfirmPassword] = useState("");

	const [success, setSuccess] = useState("");
	const [error, setError] = useState("");

	const [loading, setLoading] = useState(false);

	const submitHandller = (e) => {
		e.preventDefault();
		if ($("#updatePasswordForm").valid() && !loading) {
			setSuccess("");
			setLoading(true);
			var req = { oldPassword: oldPassword, newPassword: newPassword, confirmPassword: confirmPassword };
			postData("/api/user/updatePassword", req)
				.then((response) => {
					var data = response.data;
					setSuccess(data.success);
					setLoading(false);
					setTimeout(() => {
						setSuccess("");
					}, 10000);
					setoldPassword("");
					setnewPassword("");
					setconfirmPassword("");
				})
				.catch((error) => {
					setError(error.data.error);
					setLoading(false);
					setError(() => {
						setError("");
					}, 10000);
				});
		}
	};
	return (
		<>
		<div className="col-md-6 offset-md-3">
			<Card>
				<CardTitle className="bg-light border-bottom p-3 mb-0">
					<i className="ti-wallet mr-2"> </i>
				<strong>Update Password</strong>
				</CardTitle>
				<CardBody className="">
					<Container fluid={true}>

						<div className="row justify-content-center">
							<div className="col-md-12">

								{error && <Alert color="danger">{error}</Alert>}
								{success && <Alert color="success">{success}</Alert>}

								<div className=" mb-0">
									<form id="updatePasswordForm" className="py-3 px-3">
										
											
												
												<div className="form-group">
													<label>Old Password</label>
													<input
														type="password"
														id="oldPassword"
														name="oldPassword"
														onChange={(e) => setoldPassword(e.target.value)}
														value={oldPassword || ""}
														className="form-control cmn_input__2"
														placeholder={"Old Password"}
														maxLength={50}
														required
													/>
												</div>
										
												<div className="form-group">
													<label>New Password</label>
													<input
														type="password"
														id="newPassword"
														name="newPassword"
														onChange={(e) => setnewPassword(e.target.value)}
														value={newPassword || ""}
														className="form-control cmn_input__2"
														placeholder={"New Password"}
														data-rule-notequalto={"#oldPassword"}
														data-rule-strongpassword="true"
														maxLength={50}
														required
													/>
												</div>
											
												<div className="form-group">
													<label>Confirm Password</label>
													<input
														type="password"
														name="confirmPassword"
														onChange={(e) => setconfirmPassword(e.target.value)}
														value={confirmPassword || ""}
														className="form-control cmn_input__2"
														placeholder={"Confirm Password"}
														data-rule-equalto="#newPassword"
														data-msg-equalto={"The new password and confirmation password do not match."}
														maxLength={50}
														required
													/>
												</div>
											

											<div className=" mt-3">
												<div className="form-group">
													<button className="btn w-100 log-btn bg_blue" onClick={submitHandller} disabled={loading ? "Disabled" : ""}>
														{loading ? "Loading..." : "Update"}
													</button>
												</div>
											</div>
										
									</form>
								</div>
							</div>
						</div>

					</Container>
				</CardBody>
			</Card>
			</div>
		</>
	);
}

export default UpdatePasword;
