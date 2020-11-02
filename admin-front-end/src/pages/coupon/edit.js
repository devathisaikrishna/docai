import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { postData } from "service/Common";
import $ from "jquery";
import moment from "moment";
import DatePicker from "react-datepicker";
import { ToastMessage } from "service/ToastMessage";

class EditCouponPage extends Component {
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
		error: [],
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
					startDate: response.data.data[0].start_at,
					endDate: response.data.data[0].end_at,
					loading: false,
				});
			})
			.catch((err) => {
				this.setState({ error: err.data.error, loading: false });
			});
	}

	submitHandler = (e) => {
		e.preventDefault();

		$("#editCouponForm").validate();

		if ($("#editCouponForm").valid() && !this.state.loading) {
			this.setState({ loading: true });

			postData("/api/admin/coupon/update", {
				id: this.state.id,
				name: this.state.name,
				couponCode: this.state.couponCode,
				couponType: this.state.couponType,
				amount: this.state.amount,
				percentage: this.state.percentage,
				discountUpto: this.state.discountUpto,
				minAmount: this.state.minAmount,
				usePerPerson: this.state.usePerPerson,
				noOfUses: this.state.noOfUses,
				description: this.state.description,
				startDate: this.state.startDate,
				endDate: this.state.endDate,
			})
				.then((response) => {
					this.setState({ success: response.data.message, loading: false });
					ToastMessage(response.data.message, "s");
					setTimeout(() => {
						this.setState({ isRedirect: true });
					}, 4000);
				})
				.catch((err) => {
					this.setState({ error: err.data.error, loading: false });
				});
		}
	};

	render() {
		return (
			<div className="content-wrapper">
				{this.state.isRedirect && <Redirect to={{ pathname: `/admin/coupons` }} />}

				<div className="page-header">
					<h3 className="page-title"> Edit Coupon </h3>
				</div>

				<div className="col-lg-12 text-center">
					{this.state.error && (
						<div>
							{this.state.error.map((e) => (
								<div className="error_show_notification">
									<small>{e}</small>
								</div>
							))}
						</div>
					)}
				</div>

				<div className="container mt-5">
					<div className="row justify-content-center">
						<div className="col-xl-12">
							<div className="prof_box mb-0">
								<form method="post" id="editCouponForm">
									<div className="row">
										<div className="col-sm-6">
											<div className="form-group">
												<label htmlFor="name">Coupon Name</label>
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
												<label htmlFor="coupon_code">Coupon Code</label>
												<input
													type="text"
													name="coupon_code"
													id="coupon_code"
													className="form-control cmn_input__2"
													value={this.state.couponCode || ""}
													onChange={(e) => this.setState({ couponCode: e.target.value })}
													required
												/>
											</div>

											<div className="form-group">
												<label htmlFor="coupon_type">Coupon Type</label>
												<select
													name="coupon_type"
													className="form-control cmn_input__2"
													onChange={(e) => this.setState({ couponType: e.target.value })}
													required
													value={this.state.couponType}
												>
													<option value={""}>Select Type</option>
													<option value="1">Fixed</option>
													<option value="2">Percentage</option>
												</select>
											</div>

											{this.state.couponType == 1 && (
												<div className="form-group">
													<label htmlFor="amount">Amount</label>
													<input
														type="text"
														name="amount"
														id="amount"
														className="form-control cmn_input__2"
														value={this.state.amount}
														onChange={(e) => this.setState({ amount: e.target.value })}
														required
													/>
												</div>
											)}

											{this.state.couponType == 2 && (
												<div className="form-group">
													<label htmlFor="percentage">Percentage</label>
													<input
														type="text"
														name="percentage"
														id="percentage"
														className="form-control cmn_input__2"
														value={this.state.percentage}
														onChange={(e) => this.setState({ percentage: e.target.value })}
														required
													/>
												</div>
											)}

											{this.state.couponType == 2 && (
												<div className="form-group">
													<label htmlFor="discount_upto">Discount Upto</label>
													<input
														type="text"
														name="discount_upto"
														id="discount_upto"
														className="form-control cmn_input__2"
														value={this.state.discountUpto || ""}
														onChange={(e) => this.setState({ discountUpto: e.target.value })}
														required
													/>
												</div>
											)}

											<div className="form-group">
												<label htmlFor="min_purchase_amount">Minimum Purchase Amount</label>
												<input
													type="text"
													name="min_purchase_amount"
													id="min_purchase_amount"
													className="form-control cmn_input__2"
													value={this.state.minAmount || ""}
													onChange={(e) => this.setState({ minAmount: e.target.value })}
													required
												/>
											</div>
										</div>

										<div className="col-sm-6">
											<div className="form-group">
												<label htmlFor="num_of_person_use">Number of per person usage</label>
												<input
													type="text"
													name="num_of_person_use"
													id="num_of_person_use"
													className="form-control cmn_input__2"
													value={this.state.usePerPerson || ""}
													onChange={(e) => this.setState({ usePerPerson: e.target.value })}
													required
												/>
											</div>

											<div className="form-group">
												<label htmlFor="no_of_uses">Number of usage</label>
												<input
													type="text"
													name="no_of_uses"
													id="no_of_uses"
													className="form-control cmn_input__2"
													value={this.state.noOfUses || ""}
													onChange={(e) => this.setState({ noOfUses: e.target.value })}
													required
												/>
											</div>

											<div className="form-group">
												<label htmlFor="start_date">Start Date</label>
												<DatePicker
													required={true}
													name={"start_date"}
													dateFormat="dd-MM-yyyy"
													selected={this.state.startDate ? moment(this.state.startDate).valueOf() : null}
													onChange={(date) => {
														this.setState({ startDate: moment(date).format("YYYY-MM-DD") });
													}}
													minDate={new Date()}
													placeholderText="DD-MM-YYYY"
													className="form-control cmn_input__2"
													peekNextMonth
													showMonthDropdown
													showYearDropdown
													dropdownMode="select"
													id="start_date"
												/>
											</div>

											<div className="form-group">
												<label htmlFor="end_date">End Date</label>
												<DatePicker
													required={true}
													name={"end_date"}
													dateFormat="dd-MM-yyyy"
													selected={this.state.endDate ? moment(this.state.endDate).valueOf() : null}
													onChange={(date) => {
														this.setState({ endDate: moment(date).format("YYYY-MM-DD") });
													}}
													minDate={new Date()}
													placeholderText="DD-MM-YYYY"
													className="form-control cmn_input__2"
													peekNextMonth
													showMonthDropdown
													showYearDropdown
													dropdownMode="select"
													id="end_date"
												/>
											</div>
										</div>

										<div className="col-sm-12">
											<div className="form-group">
												<label htmlFor="description">Description</label>
												<textarea
													className="form-control"
													name="description"
													id="description"
													cols="30"
													rows="10"
													onChange={(e) => this.setState({ description: e.target.value })}
													value={this.state.description}
												></textarea>
											</div>
										</div>
									</div>

									<div className="form-group">
										<button className="btn w-100 log-btn bg_blue" onClick={this.submitHandler}>
											{this.state.loading ? <span>Loading...</span> : "Save"}
										</button>
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

export default EditCouponPage;
