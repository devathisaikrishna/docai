import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { postData } from "service/Common";
import { getUserProfile } from "actions/UserActions";
import $ from "jquery";
import { Alert, Container, Card, CardBody, CardTitle } from 'reactstrap';

function UserProfilePage(props) {
	const dispatch = useDispatch();
	const UserReducers = useSelector((state) => {
		return state.UserReducers.UserProfileReducers;
	});
	const { userProfileInfo } = UserReducers;

	const [profileData, setprofileData] = useState(() => {
		return { firstname: "", lastname: "", email: "", phone: "", created: "" };
	});

	const [success, setSuccess] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		dispatch(getUserProfile());
	}, []);
	useEffect(() => {
		if (userProfileInfo) {
			setprofileData(userProfileInfo);
			setLoading(false);
		}
	}, [userProfileInfo]);

	const submitHandller = (e) => {
		e.preventDefault();
		if ($("#updateProfileForm").valid() && !loading) {
			setSuccess("");
			setLoading(true);
			var req = { firstname: profileData.firstname, lastname: profileData.lastname, email: profileData.email, phone: profileData.phone };
			postData("/api/user/updateProfile", req)
				.then((response) => {
					var data = response.data;
					setSuccess(data.message);
					dispatch(getUserProfile());
					setLoading(false);
					setTimeout(() => {
						setSuccess("");
					}, 10000);
				})
				.catch((error) => {
					setError(error.data.error);
					setLoading(false);
				});
		}
	};

	return (
		<>
		<div className="col-md-8 offset-md-2">
			<Card>
				<CardTitle className="bg-light border-bottom p-3 mb-0">
					<i className="ti-user mr-2"> </i>
					<strong>Update Profile</strong>
					</CardTitle>
				<CardBody className="">
					<Container fluid={true}>

						{error && <div><Alert color="danger">{error}</Alert></div>}
						{success && <div><Alert color="success">{success}</Alert></div>}
						
						<div className="row justify-content-center">
							<div className="col-md-12">
								<div className=" mb-0">
									<form id="updateProfileForm" className="py-3 px-3">
										<div className="row">
											<div className="col-md-6">
												<div className="form-group">
													<label>First Name</label>
													<input
														type="text"
														name="firstname"
														onChange={(e) => {
															setprofileData({ ...profileData, firstname: e.target.value });
														}}
														value={profileData.firstname || ""}
														className="form-control cmn_input__2"
														placeholder={"First Name"}
														maxLength={100}
														required
													/>
												</div>
											</div>
											<div className="col-md-6">
												<div className="form-group">
													<label>Last Name</label>
													<input
														type="text"
														name="lastname"
														onChange={(e) => {
															setprofileData({ ...profileData, lastname: e.target.value });
														}}
														value={profileData.lastname || ""}
														className="form-control cmn_input__2"
														placeholder={"Last Name"}
														maxLength={100}
														required
													/>
												</div>
											</div>
											<div className="col-md-6">
												<div className="form-group">
													<label>Email</label>
													<input
														type="text"
														name="email"
														onChange={(e) => {
															setprofileData({ ...profileData, email: e.target.value });
														}}
														value={profileData.email || ""}
														className="form-control cmn_input__2"
														placeholder={"xyz@example.com"}
														data-rule-email={true}
														maxLength={180}
														required
													/>
												</div>
											</div>
											<div className="col-md-6">
												<div className="form-group">
													<label>Phone</label>
													<input
														type="text"
														name="phome"
														onChange={(e) => {
															setprofileData({ ...profileData, phone: e.target.value });
														}}
														value={profileData.phone || ""}
														className="form-control cmn_input__2"
														placeholder={"+91xxxxxxxxxx"}
														data-rule-phonenumber={true}
														maxLength={18}
														required
													/>
												</div>
											</div>

											<div className="col-md-12 mt-3">
												<div className="form-group">
													<button className="btn w-100 log-btn bg_blue" onClick={submitHandller} disabled={loading ? "Disabled" : ""}>
														{loading ? "Loading..." : "Update"}
													</button>
												</div>
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

export default UserProfilePage;
