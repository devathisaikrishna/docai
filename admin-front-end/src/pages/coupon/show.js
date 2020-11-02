import React, { Component } from "react";
import { Link } from "react-router-dom";
import { postData } from "service/Common";
import moment from "moment";
import { CURRENCY_ICON } from "config/Constants";

class ShowCouponPage extends Component {
	state = {
		id: "",
		name: "",
		couponCode: "",
		couponType: "",
		amount: 0,
		percentage: 0,
		discountUpto: 0,
		minAmount: 0,
		usePerPerson: 0,
		noOfUses: 0,
		description: "",
		startDate: "",
		endDate: "",
		isRedirect: false,
		loading: false,
	};

	componentDidMount() {
		const {
			match: { params },
		} = this.props;

		this.setState({ loading: true });

		postData("/api/admin/coupon/show", { id: params.couponId })
			.then((response) => {
				this.setState({
					id: response.data.data[0].id,
					name: response.data.data[0].name,
					couponCode: response.data.data[0].coupon_code,
					couponType: response.data.data[0].coupon_type,
					amount: response.data.data[0].amount,
					percentage: response.data.data[0].percentage,
					discountUpto: response.data.data[0].discount_up_to,
					minAmount: response.data.data[0].minimum_purchase_amount,
					usePerPerson: response.data.data[0].number_of_per_person_use,
					noOfUses: response.data.data[0].number_of_uses,
					description: response.data.data[0].description,
					startDate: moment(response.data.data[0].start_at).format("DD-MM-YYYY"),
					endDate: moment(response.data.data[0].end_at).format("DD-MM-YYYY"),
					loading: false,
				});
			})
			.catch((err) => {
				this.setState({ error: err.data.error, loading: false });
			});
	}

	render() {
		return (
			<div className="content-wrapper">
				<div className="page-header">
					<h3 className="page-title"> Show Coupon </h3>
				</div>

				<div className="container mt-5">
					<div className="row justify-content-center">
						<div className="col-xl-12">
							<div className="prof_box mb-0">
								<form method="post" id="editCouponForm">
									<div className="row">
										<div className="col-sm-6">
											<div className="form-group">
												<label htmlFor="name">
													<span className="mr-10">Coupon Name:</span>
													<strong>{this.state.name}</strong>
												</label>
											</div>

											<div className="form-group">
												<label htmlFor="coupon_code">
													<span className="mr-10">Coupon Code:</span>
													<strong>{this.state.couponCode}</strong>
												</label>
											</div>

											<div className="form-group">
												<label htmlFor="coupon_type">
													<span className="mr-10">Coupon Type:</span>
													<strong>{this.state.couponType == 1 ? "Fixed" : "Percentage"}</strong>
												</label>
											</div>

											{this.state.couponType == 1 && (
												<div className="form-group">
													<label htmlFor="amount">
														<span className="mr-10">Amount:</span>
														<strong>{CURRENCY_ICON + this.state.amount}</strong>
													</label>
												</div>
											)}

											{this.state.couponType == 2 && (
												<div className="form-group">
													<label htmlFor="percentage">
														<span className="mr-10">Percentage:</span>
														<strong>{this.state.percentage + "%"}</strong>
													</label>
												</div>
											)}

											{this.state.couponType == 2 && (
												<div className="form-group">
													<label htmlFor="discount_upto">
														<span className="mr-10">Discount Upto:</span>
														<strong>{CURRENCY_ICON + this.state.discountUpto}</strong>
													</label>
												</div>
											)}

											<div className="form-group">
												<label htmlFor="min_purchase_amount">
													<span className="mr-10">Minimum Purchase Amount:</span>
													<strong>{CURRENCY_ICON + this.state.minAmount}</strong>
												</label>
											</div>
										</div>

										<div className="col-sm-6">
											<div className="form-group">
												<label htmlFor="num_of_person_use">
													<span className="mr-10">Number of per person usage:</span>
													<strong>{this.state.usePerPerson}</strong>
												</label>
											</div>

											<div className="form-group">
												<label htmlFor="no_of_uses">
													<span className="mr-10">Number of usage:</span>
													<strong>{this.state.noOfUses}</strong>
												</label>
											</div>

											<div className="form-group">
												<label htmlFor="start_date">
													<span className="mr-10">Start Date:</span>
													<strong>{this.state.startDate}</strong>
												</label>
											</div>

											<div className="form-group">
												<label htmlFor="end_date">
													<span className="mr-10">End Date:</span>
													<strong>{this.state.endDate}</strong>
												</label>
											</div>
										</div>

										<div className="col-sm-12">
											<div className="form-group">
												<label htmlFor="description">
													<span className="mr-10">Description:</span>
													<strong>{this.state.description || "N/A"}</strong>
												</label>
											</div>
										</div>
									</div>

									<div className="form-group">
										<Link to={{ pathname: "/admin/coupons" }}>
											<button className="btn w-100 log-btn bg_blue">Back</button>
										</Link>
									</div>
								</form>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default ShowCouponPage;
