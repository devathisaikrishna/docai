import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { get_current_plan, clear_current_plan } from "../actions/PlanAction";
import moment from "moment";
import { CURRENCY_ICON } from "../config/Constants";
import { Badge, Container, Card, CardBody, CardTitle } from "reactstrap";
import BlockUi from "react-block-ui";
import Loader from "react-loaders";
import "react-block-ui/style.css";
import "loaders.css/loaders.min.css";
import { postData } from "../service/Common";
import React_Table from "../components/React-Table/Table";

function CurrentPlanPage(props) {
	const refTable = useRef(null);

	const columns = React.useMemo(() => [
		{
			Header: "Payment ID",
			accessor: "payment_id",
		},
		{
			Header: "Plan Amount",
			Cell: (result) => <span>{CURRENCY_ICON + result.row.original.plan_amount}</span>,
		},
		{
			Header: "Total Amount",
			Cell: (result) => <span>{CURRENCY_ICON + result.row.original.total}</span>,
		},
		{
			Header: "Payment Type",
			Cell: (result) => <span>{result.row.original.payment_type ? "Credit Card" : "Debit Card"}</span>,
		},
		{
			Header: "Status",
			Cell: (result) => (
				<Badge color="success" pill>
					{result.row.original.payment_status_label}
				</Badge>
			),
		},
		{
			Header: "Payment Date",
			accessor: "payment_date",
		},
		{
			Header: "Actions",
			Cell: (props) => (
				<span>
					<Link to={{ pathname: `/user/project/${props.row.original.payment_id}/show` }}>
						<button className="btn btn-info btn-rounded btn-fw btn-small mr-2">View</button>
					</Link>
				</span>
			),
		},
	]);

	const dispatch = useDispatch();
	const CurrentPlanReducers = useSelector((state) => state.UserReducers.PlanReducers);
	const { current_plan, subscription, next_payment, current_plan_loading, payments } = CurrentPlanReducers;
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [pageCount, setPageCount] = useState(0);

	const fetchData = React.useCallback(({ pageSize, pageIndex, sortBy, globalFilter }) => {
		setLoading(true);

		let req = { page_size: pageSize, start: pageIndex, sort_by: sortBy, search: globalFilter };
		postData("/api/user/payments", req)
			.then((response) => {
				var res = response.data;
				setData(res.data);
				setPageCount(Math.ceil(parseInt(res.total) / pageSize));
				setLoading(false);
			})
			.catch((err) => {});
	}, []);

	useEffect(() => {
		dispatch(get_current_plan());

		return () => {
			dispatch(clear_current_plan());
		};
	}, []);

	return (
		<>
			<BlockUi tag="div" blocking={current_plan_loading} loader={<Loader active type={"ball-scale-multiple"} color="#7b8199" />}>
				<Card>
					<CardTitle className="bg-light border-bottom p-3 mb-0">
						<i className="mdi mdi-toggle-switch mr-2"> </i>
						<span>Current Plan</span>
					</CardTitle>
					<CardBody className="">
						<Container fluid={true}>
							<div className="row">
								<div className="col-md-12">
									{current_plan.no_plan ? (
										<div className="row justify-content-center">
											<div className="empty_card">
												<img src={"./img/empty_card.jpg"} />
												<h3>No Active Plan</h3>
												<Link className="btn cmn_btn bg_yellow" to="/user/purchase_plan">
													Buy Now
												</Link>
											</div>
										</div>
									) : (
										<div className="row">
											<div className="col-md-6">
												<div className="row">
													<div className="col-md-6">
														<label>Plan name:</label>
													</div>
													<div className="col-md-6">
														<strong>{current_plan.plan_name}</strong>
													</div>
												</div>
												<div className="row">
													<div className="col-md-6">
														<label>Total number of hits:</label>
													</div>
													<div className="col-md-6">
														<strong>{current_plan.num_of_hit}</strong>
													</div>
												</div>
												<div className="row">
													<div className="col-md-6">
														<label>Remaining hits:</label>
													</div>
													<div className="col-md-6">
														<strong>{current_plan.remaining_hit}</strong>
													</div>
												</div>
											</div>
											<div className="col-md-6">
												<div className="row">
													<div className="col-md-6">
														<label>Plan type:</label>
													</div>
													<div className="col-md-6">
														<strong>{current_plan.plan_type_label}</strong>
													</div>
												</div>
												<div className="row">
													<div className="col-md-6">
														<label>Plan start:</label>
													</div>
													<div className="col-md-6">
														<strong>{moment(current_plan.plan_start_at).format("DD/MM/YYYY")}</strong>
													</div>
												</div>
												<div className="row">
													<div className="col-md-6">
														<label>Plan End:</label>
													</div>
													<div className="col-md-6">
														<strong>{moment(current_plan.plan_end_at).format("DD/MM/YYYY")}</strong>
													</div>
												</div>
											</div>
										</div>
									)}
								</div>
							</div>
						</Container>
					</CardBody>
				</Card>
			</BlockUi>

			{!subscription.no_subscription && (
				<>
					<Card>
						<CardTitle className="bg-light border-bottom p-3 mb-0">
							<i className="mdi mdi-comment-processing-outline mr-2"> </i>
							<span>Subscription Details</span>
						</CardTitle>
						<CardBody className="">
							<Container fluid={true}>
								<div className="row">
									<div className="col-md-6">
										<div className="row">
											<div className="col-md-6">
												<label>Billing Frequency:</label>
											</div>
											<div className="col-md-6">
												<strong>{subscription.billing_frequency == 1 ? "Monthly" : "Yearly"}</strong>
											</div>
										</div>

										<div className="row">
											<div className="col-md-6">
												<label>Subscription start:</label>
											</div>
											<div className="col-md-6">
												<strong>{subscription.start_at ? moment(subscription.start_at).format("DD/MM/YYYY") : "Not Started Yet"}</strong>
											</div>
										</div>
										<div className="row">
											<div className="col-md-6">
												<label>Recurring Amount:</label>
											</div>
											<div className="col-md-6">
												<strong>
													{CURRENCY_ICON}
													{subscription.recurring_amount}
												</strong>
											</div>
										</div>

										{parseInt(subscription.status) === 1 && (
											<div className="row">
												<div className="col-md-6">
													<label>Start Subscription:</label>
												</div>
												<div className="col-md-6">
													<strong>
														<a
															target="_blank"
															href={subscription.rz_subscription_link}
															style={{ fontSize: ".76563rem" }}
															type="button"
															className="btn btn-info react-bs-table-add-btn "
														>
															<span>
																<i className="fa glyphicon glyphicon-plus fa-plus"></i> Start Subscription
															</span>
														</a>
													</strong>
												</div>
											</div>
										)}

										{parseInt(subscription.status) === 2 && (
											<div className="row">
												<div className="col-md-6">
													<label>Change Card</label>
												</div>
												<div className="col-md-6">
													<strong>
														<a
															target="_blank"
															href={subscription.rz_subscription_link}
															style={{ fontSize: ".76563rem" }}
															type="button"
															className="btn btn-info react-bs-table-add-btn "
														>
															<span>
																<i className="fas fa-credit-card"></i> Change Card
															</span>
														</a>
													</strong>
												</div>
											</div>
										)}
									</div>

									<div className="col-md-6">
										<div className="row">
											<div className="col-md-6">
												<label>Status:</label>
											</div>
											<div className="col-md-6">
												<strong>{subscription.status_label}</strong>
											</div>
										</div>
										<div className="row">
											<div className="col-md-6">
												<label>Plan Name:</label>
											</div>
											<div className="col-md-6">
												<strong>{subscription.plan_name}</strong>
											</div>
										</div>
									</div>
								</div>
							</Container>
						</CardBody>
					</Card>

					{parseInt(subscription.status) === 2 && (
						<Card>
							<CardTitle className="bg-light border-bottom p-3 mb-0">
								<i className="mdi mdi-comment-processing-outline mr-2"> </i>
								<span>Next Payment</span>
							</CardTitle>
							<CardBody className="">
								<Container fluid={true}>
									<div className="row">
										<div className="col-md-6">
											<div className="row">
												<div className="col-md-6">
													<label>Payment Date:</label>
												</div>
												<div className="col-md-6">
													<strong>{next_payment.nextPaymentDate}</strong>
												</div>
											</div>
										</div>
										<div className="col-md-6">
											<div className="row">
												<div className="col-md-6">
													<label>Price:</label>
												</div>
												<div className="col-md-6">
													<strong>
														{CURRENCY_ICON}
														{next_payment.total}
													</strong>
												</div>
											</div>
										</div>
									</div>
								</Container>
							</CardBody>
						</Card>
					)}

					<Card>
						<CardTitle className="bg-light border-bottom p-3 mb-0">
							<i className="mdi mdi-comment-processing-outline mr-2"> </i>
							<span>Transaction History</span>
						</CardTitle>
						<CardBody className="">
							<Container fluid={true}>
								<React_Table ref={refTable} columns={columns} data={data} fetchData={fetchData} loading={loading} pageCount={pageCount} />
							</Container>
						</CardBody>
					</Card>
				</>
			)}
		</>
	);
}

export default CurrentPlanPage;
