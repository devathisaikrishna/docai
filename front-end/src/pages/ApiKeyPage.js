import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { postData } from "service/Common";
import { getApiKey } from "actions/ApiKeyActions";
import { useDispatch, useSelector } from "react-redux";
import { Alert, Jumbotron, Button, Container, Card, CardBody, CardTitle } from "reactstrap";
import BlockUi from "react-block-ui";
import Loader from "react-loaders";
import "react-block-ui/style.css";
import "loaders.css/loaders.min.css";

function RequestForKeyGenration(props) {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	const ApiKeyReducers = useSelector((state) => state.UserReducers.ApiKeyReducers);
	const { loading: apiKeyLoading, message: MessageApiStatus, api_key_status, getApiKeyFailed, client_id } = ApiKeyReducers;

	const dispatch = useDispatch();

	const submitHandler = (e) => {
		e.preventDefault();

		resetMessage();
		setLoading(true);
		postData("/api/user/request_for_key", {})
			.then((response) => {
				var data = response.data;
				setSuccess(data.message);
				setLoading(false);
				dispatch(getApiKey());
				setTimeout(() => {
					resetMessage();
				}, 10000);
			})
			.catch((error) => {
				setError(error.data.error);
				setLoading(false);
			});
	};

	const resetMessage = () => {
		setError("");
	};

	useEffect(() => {
		dispatch(getApiKey());
	}, []);

	return (
		<>
			{api_key_status === 2 && <Redirect to="/user/projects_listing" />}
			<BlockUi tag="div" blocking={apiKeyLoading} loader={<Loader active type={"ball-scale-multiple"} color="#7b8199" />}>
				<Card>
					<CardTitle className="bg-light border-bottom p-3 mb-0">
						<i className="mdi mdi-comment-processing-outline mr-2"> </i>
						Api Request
					</CardTitle>
					<CardBody className="">
						<Container fluid={true}>
							{error && <Alert color="danger">{error}</Alert>}
							{success && <Alert color="success">{success}</Alert>}

							<Jumbotron className="text-center">
								<h1 className="display-3">Hello, world!</h1>
								<p className="lead">
									This is a simple hero unit, a simple Jumbotron-style component for calling extra attention to featured content or information.
								</p>
								<hr className="my-2" />
								<p>It uses utility classes for typography and spacing to space content out within the larger container.</p>
								<p className="lead">
									{api_key_status === 0 && (
										<Button onClick={submitHandler} color="primary">
											{loading ? <span>Loading...</span> : "Request for Key"}
										</Button>
									)}

									{(api_key_status === 1 || api_key_status === 3) && (
										<Container>
											<Alert color="info">{MessageApiStatus}</Alert>
										</Container>
									)}
								</p>
							</Jumbotron>
						</Container>
					</CardBody>
				</Card>
			</BlockUi>
		</>
	);
}

export default RequestForKeyGenration;
