import React, { Component } from "react";
import { postData } from "service/Common";
import { Link } from "react-router-dom";
import { Container, Card, CardBody, CardTitle } from "reactstrap";
import BlockUi from "react-block-ui";
import Loader from "react-loaders";
import "react-block-ui/style.css";
import "loaders.css/loaders.min.css";

class ShowProject extends Component {
	state = {
		id: "",
		name: "",
		redirect: "",
		allow_domain: "",
		secret: "",
		dummySecret: "************************************",
		showSecret: false,
		showSecretOnce: false,
		loading: false,
		error: "",
		success: "",
	};

	componentDidMount() {
		const {
			match: { params },
			location: { state },
		} = this.props;

		this.setState({ id: params.projectId, loading: true });

		postData("/api/project/show", { id: params.projectId })
			.then((response) => {
				this.setState({
					id: response.data.data[0].id,
					name: response.data.data[0].name,
					redirect: response.data.data[0].redirect,
					allow_domain: response.data.data[0].allow_domain,
					loading: false,
				});
			})
			.catch((err) => {
				this.setState({ error: err.data.error, loading: false });
			});

		if (state !== undefined && state.first) {
			postData("/api/user/regenerate_api_key", { id: params.projectId })
				.then((response) => {
					this.setState({ showSecretOnce: true, showSecret: true, secret: response.data.secret_key });
				})
				.catch((err) => {
					this.setState({ error: err.data.error });
				});
		}
	}

	toggleHandler = () => {
		const doesShow = this.state.showSecret;
		this.setState({ showSecret: !doesShow });
	};

	regenerateApiKey = (e) => {
		e.preventDefault();
		postData("/api/user/regenerate_api_key", { id: this.state.id })
			.then((response) => {
				this.setState({ showSecretOnce: true, showSecret: true, secret: response.data.secret_key });
			})
			.catch((err) => {
				this.setState({ error: err.data.error });
			});
	};

	render() {
		return (
			<>
				<BlockUi tag="div" blocking={this.state.loading} loader={<Loader active type={"ball-scale-multiple"} color="#7b8199" />}>
					<Card>
						<CardTitle className="bg-light border-bottom p-3 mb-0">
							<i className="mdi mdi-apps mr-2"> </i>
							<strong>Project Detail</strong>
						</CardTitle>
						<CardBody className="">
							<Container fluid={true}>
								{this.state.error && <div className="error_show_notification">{this.state.error}</div>}
								{this.state.success && <div className="success_show_notification">{this.state.success}</div>}

								{this.state.loading ? (
									<span>Loading...</span>
								) : (
									<div>
										<div className="form-group">
											<label htmlFor="name">
												Project Name : <strong>{this.state.name}</strong>
											</label>
										</div>

										<div className="form-group">
											<label htmlFor="redirect">
												Redirect URL : <strong>{this.state.redirect}</strong>
											</label>
										</div>
										{this.state.allow_domain ? (
											<div className="form-group">
												<label htmlFor="redirect">
													Allow Domain : <strong>{this.state.allow_domain}</strong>
												</label>
											</div>
										) : (
											""
										)}

										<div className="form-group">
											<label htmlFor="secret">
												Client Key : <strong>{this.state.id}</strong>
											</label>
										</div>

										<div className="form-group">
											<label htmlFor="secret">
												Secret Key : {this.state.showSecret ? <strong>{this.state.secret}</strong> : <strong>{this.state.dummySecret}</strong>}
												{this.state.showSecretOnce ? (
													<button className="btn btn-danger btn-rounded btn-fw btn-small ml-2" onClick={this.toggleHandler}>
														{this.state.showSecret ? "Hide" : "Show"}
													</button>
												) : null}
												<button onClick={this.regenerateApiKey} className="btn btn-success btn-rounded btn-fw btn-small ml-2">
													Regenerate Key
												</button>
											</label>
											{this.state.showSecretOnce ? (
												<div>
													<strong>
														<small className="text-danger">
															This api key will generate a secret key. So, you need to copy the secret key as the key will be displayed only once.
														</small>
													</strong>
												</div>
											) : null}
										</div>
										<div className="form-group">
											<Link to={{ pathname: "/user/projects_listing" }}>
												<button className="btn log-btn bg_blue">Back</button>
											</Link>
										</div>
									</div>
								)}
							</Container>
						</CardBody>
					</Card>
				</BlockUi>
			</>
		);
	}
}

export default ShowProject;
