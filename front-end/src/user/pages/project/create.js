import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { postData } from "user/service/Common";
import $ from "jquery";

const CreateProject = () => {
	const [client, setClient] = useState("");
	const [isRedirect, setIsRedirect] = useState(false);
	const [name, setName] = useState("");
	const [redirect, setRedirect] = useState("");
	const [loading, setLoading] = useState("");
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	const submitHandler = (e) => {
		e.preventDefault();

		$("#createForm").validate();

		if ($("#createForm").valid() && !loading) {
			resetMessage();
			setLoading(true);
			let request = { name, redirect };
			postData("/api/project", request)
				.then((response) => {
					setSuccess(response.data.message);
					setClient(response.data.client);
					setIsRedirect(true);
					setLoading(false);
					resetForm();
					// setTimeout(() => {
					// 	resetMessage();
					// }, 5000);
				})
				.catch((err) => {
					setError(err.data.error);
					setLoading(false);
				});
		}
	};

	const resetForm = () => {
		setName("");
		setRedirect("");
	};

	const resetMessage = () => {
		setSuccess("");
		setError("");
	};

	return (
		<div className="content-wrapper">
			{isRedirect && <Redirect to={{ pathname: `/user/project/${client}/show`, state: { first: true } }} />}

			{/* <!-- ======= Breadcrumbs ======= --> */}
			<section id="breadcrumbs" className="breadcrumbs">
				<div className="container">
					<ol>
						<li>
							<a href="/">Home</a>
						</li>
						<li>Add Project</li>
					</ol>
					<h2>Add Project</h2>
				</div>
			</section>

			{/* <!-- End Breadcrumbs --> */}

			<div className="container mt-5">
				<div className="row justify-content-center">
					<div className="col-lg-12 text-center">
						{error && <div className="error_show_notification">{error}</div>}
						{success && <div className="success_show_notification">{success}</div>}
					</div>
					<div className="col-md-8 col-lg-9 col-xl-7">
						<div className="row justify-content-center">
							<div className="col-md-9">
								<div className="prof_box mb-0">
									<form method="post" id="createForm">
										<div className="form-group">
											<label htmlFor="name">Project Name</label>
											<input
												type="text"
												name="name"
												id="name"
												className="form-control cmn_input__2"
												value={name || ""}
												onChange={(e) => setName(e.target.value)}
												required
											/>
										</div>

										<div className="form-group">
											<label htmlFor="redirect">Redirect URL</label>
											<input
												type="text"
												name="redirect"
												id="redirect"
												className="form-control cmn_input__2"
												value={redirect || ""}
												onChange={(e) => setRedirect(e.target.value)}
												required
											/>
										</div>

										<div className="form-group">
											<button className="btn w-100 log-btn bg_blue" onClick={submitHandler}>
												{loading ? <span>Loading...</span> : "Save"}
											</button>
										</div>
									</form>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CreateProject;
