import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { postData } from "../../service/Common";
import $ from "jquery";
import { Alert, Container, Card, CardBody, CardTitle } from "reactstrap";
import BlockUi from "react-block-ui";
import Loader from "react-loaders";
import "react-block-ui/style.css";
import "loaders.css/loaders.min.css";

const CreateProject = () => {
	const [client, setClient] = useState("");
	const [isRedirect, setIsRedirect] = useState(false);
	const [allow_domain, setAllow_domain] = useState("");
	const [name, setName] = useState("");
	const [redirect, setRedirect] = useState("");
	const [loading, setLoading] = useState("");
	const [loader, setLoader] = useState(true);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	useEffect(() => {
		setTimeout(() => {
			setLoader(false);
		}, 1000);
	});

	const submitHandler = (e) => {
		e.preventDefault();

		$("#createForm").validate();

		if ($("#createForm").valid() && !loading) {
			resetMessage();
			setLoading(true);
			let request = { name, redirect, allow_domain };
			postData("/api/project", request)
				.then((response) => {
					setSuccess(response.data.message);
					setClient(response.data.client);
					setIsRedirect(true);
					setLoading(false);
					resetForm();
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
		setAllow_domain("");
	};

	const resetMessage = () => {
		setSuccess("");
		setError("");
	};

	return (
		<>
			{isRedirect && <Redirect to={{ pathname: `/user/project/${client}/show`, state: { first: true } }} />}
			<BlockUi tag="div" blocking={loader} loader={<Loader active type={"ball-scale-multiple"} color="#7b8199" />}>
				<Card>
					<CardTitle className="bg-light border-bottom p-3 mb-0">
						<i className="mdi mdi-apps mr-2"> </i>
						Create Project
					</CardTitle>
					<CardBody className="">
						<Container fluid={true}>
							{error && <Alert color="danger">{error}</Alert>}
							{success && <Alert color="success">{success}</Alert>}

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
									<label htmlFor="allow_domain">Allow Domain (Optional)</label>
									<input
										type="text"
										name="allow_domain"
										id="allow_domain"
										className="form-control cmn_input__2"
										value={allow_domain || ""}
										onChange={(e) => setAllow_domain(e.target.value)}
									/>
								</div>

								<div className="form-group">
									<button className="btn w-100 log-btn bg_blue" onClick={submitHandler}>
										{loading ? <span>Loading...</span> : "Save"}
									</button>
								</div>
							</form>
						</Container>
					</CardBody>
				</Card>
			</BlockUi>
		</>
	);
};

export default CreateProject;
