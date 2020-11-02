import React, { Component } from "react";
import { Link } from "react-router-dom";
import { postData } from "../service/Common";
import BlockUi from "react-block-ui";
import Loader from "react-loaders";
import "react-block-ui/style.css";
import "loaders.css/loaders.min.css";
import { Container, Card, CardBody, CardTitle } from "reactstrap";

class ApiLogDetailsPage extends Component {
	state = {
		id: "",
		name: "",
		token: "",
		project_id: "",
		requested_file_path: "",
		request_domain: "",
		ip_address: "",
		user_agent: "",
		ai_response: "",
		ai_response_status: "",
		loading: false,
		error: "",
		success: "",
	};

	componentDidMount() {
		const {
			match: { params },
		} = this.props;

		this.setState({ id: params.logId, loading: true });

		postData("/api/service_logs/show", { id: params.logId })
			.then((response) => {
				this.setState({
					id: response.data.data[0].id,
					name: response.data.data[0].name,
					project_id: response.data.data[0].project_id,
					requested_file_path: response.data.data[0].requested_file_path,
					request_domain: response.data.data[0].request_domain,
					ip_address: response.data.data[0].ip_address,
					user_agent: response.data.data[0].user_agent,
					ai_response: response.data.data[0].ai_response,
					ai_response_status: response.data.data[0].ai_response_status,
					created: response.data.data[0].created,
					loading: false,
				});
			})
			.catch((err) => {
				this.setState({ error: err.data.error, loading: false });
			});
	}

	render() {
		return (
			<BlockUi tag="div" blocking={this.state.loading} loader={<Loader active type={"ball-scale-multiple"} color="#7b8199" />}>
				<Card>
					<CardTitle className="bg-light border-bottom p-3 mb-0">
						<div className="d-flex justify-content-between">
							<div>
								<i className="fa fa-tasks mr-2"> </i>
								<span>Project Details</span>
							</div>
							<div>
								<Link to="/user/api_log" style={{ fontSize: ".76563rem" }} type="button" className="btn btn-info react-bs-table-add-btn ">
									<span>
										<i className="fa glyphicon glyphicon-plus fa-plus"></i> Api Logs
									</span>
								</Link>
							</div>
						</div>
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
											Requested File Path : <strong>{this.state.requested_file_path}</strong>
										</label>
									</div>

									<div className="form-group">
										<label htmlFor="secret">
											Request Domain : <strong>{this.state.request_domain}</strong>
										</label>
									</div>

									<div className="form-group">
										<label htmlFor="secret">
											IP Address : <strong>{this.state.ip_address}</strong>
										</label>
									</div>

									<div className="form-group">
										<label htmlFor="secret">
											User Agent : <strong>{this.state.user_agent}</strong>
										</label>
									</div>

									<div className="form-group">
										<label htmlFor="secret">
											Created At : <strong>{this.state.created}</strong>
										</label>
									</div>

									<div className="form-group">
										<Link to={{ pathname: "/user/api_log" }}>
											<button className="btn log-btn bg_blue">Back</button>
										</Link>
									</div>
								</div>
							)}
						</Container>
					</CardBody>
				</Card>
			</BlockUi>
		);
	}
}

export default ApiLogDetailsPage;
