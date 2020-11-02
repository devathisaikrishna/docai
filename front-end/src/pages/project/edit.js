import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { postData } from "service/Common";
import $ from "jquery";
import { Alert, Container, Card, CardBody, CardTitle } from "reactstrap";
import BlockUi from "react-block-ui";
import Loader from "react-loaders";
import "react-block-ui/style.css";
import "loaders.css/loaders.min.css";
class EditProject extends Component {
	state = {
		id: "",
		name: "",
		redirect: "",
		allow_domain: "",
		redirectprojectList: false,
		loading: false,
		loader: false,
		error: "",
		success: "",
		invalid: false,
	};

	componentDidMount() {
		const {
			match: { params },
		} = this.props;

		this.setState({ loader: true });

		postData("/api/project/edit", { id: params.projectId })
			.then((response) => {
				this.setState({
					id: response.data.data[0].id,
					name: response.data.data[0].name,
					redirect: response.data.data[0].redirect,
					allow_domain: response.data.data[0].allow_domain,
					loader: false,
				});
			})
			.catch((err) => {
				if (err.status === 401) {
					this.setState({ invalid: true });
				}
				this.setState({ error: err.data.error, loader: false });
			});
	}

	submitHandler = (e) => {
		e.preventDefault();

		$("#editForm").validate();

		if ($("#editForm").valid() && !this.state.loading) {
			this.resetMessage();
			this.setState({ loading: true });

			postData("/api/project/update", {
				id: this.state.id,
				name: this.state.name,
				redirect: this.state.redirect,
				allow_domain: this.state.allow_domain,
			})
				.then((response) => {
					this.setState({ success: response.data.message, loading: false });
					setTimeout(() => {
						this.resetMessage();
						this.setState({ redirectprojectList: true });
					}, 3000);
				})
				.catch((err) => {
					this.setState({ error: err.data.error, loading: false });
				});
		}
	};

	resetMessage = () => {
		this.setState({ success: "", error: "" });
	};

	render() {
		if (this.state.redirectprojectList) {
			return <Redirect to={"/user/api_key"} />;
		}
		return (
			<>
				{this.state.invalid && <Redirect to="/user/api_key" />}
				<BlockUi tag="div" blocking={this.state.loader} loader={<Loader active type={"ball-scale-multiple"} color="#7b8199" />}>
					<Card>
						<CardTitle className="bg-light border-bottom p-3 mb-0">
							<i className="mdi mdi-apps mr-2"> </i>
							Edit Project
						</CardTitle>
						<CardBody className="">
							<Container fluid={true}>
								{this.state.error && <Alert color="danger">{this.state.error}</Alert>}
								{this.state.success && <Alert color="success">{this.state.success}</Alert>}

								<div className=" mb-0">
									<form method="post" id="editForm">
										<div className="form-group">
											<label htmlFor="name">Project Name</label>
											<input
												type="text"
												name="name"
												id="name"
												className="form-control cmn_input__2"
												value={this.state.name || ""}
												onChange={(e) => this.setState({ name: e.target.value })}
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
												value={this.state.redirect || ""}
												onChange={(e) => this.setState({ redirect: e.target.value })}
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
												value={this.state.allow_domain || ""}
												onChange={(e) => this.setState({ allow_domain: e.target.value })}
											/>
										</div>
										<div className="form-group">
											<button className="btn w-100 log-btn bg_blue" onClick={this.submitHandler}>
												{this.state.loading ? <span>Loading...</span> : "Save"}
											</button>
										</div>
									</form>
								</div>
							</Container>
						</CardBody>
					</Card>
				</BlockUi>
			</>
		);
	}
}

export default EditProject;
