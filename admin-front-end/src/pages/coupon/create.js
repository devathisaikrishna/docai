import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { postData } from "service/Common";
import $ from "jquery";
import moment from "moment";
import DatePicker from "react-datepicker";
import { ToastMessage } from "service/ToastMessage";

const AddCouponPage = () => {
	const [name, setName] = useState("");
	const [couponCode, setCouponCode] = useState("");
	const [couponType, setCouponType] = useState("");
	const [amount, setAmount] = useState(0);
	const [percentage, setPercentage] = useState(0);
	const [discountUpto, SetDiscountUpto] = useState(0);
	const [minAmount, setMinAmount] = useState(0);
	const [usePerPerson, setUsePerPerson] = useState(0);
	const [noOfUses, setNoOfUses] = useState(0);
	const [description, setDescription] = useState("");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [isRedirect, setIsRedirect] = useState(false);
	const [loading, setLoading] = useState("");
	const [error, setError] = useState([]);

	const submitHandler = (e) => {
		e.preventDefault();

		$("#createCouponForm").validate();

		if ($("#createCouponForm").valid() && !loading) {
			setLoading(true);
			let request = {
				name,
				couponCode,
				couponType,
				amount,
				percentage,
				discountUpto,
				minAmount,
				usePerPerson,
				noOfUses,
				description,
				startDate,
				endDate,
			};
			postData("/api/admin/coupon/create", request)
				.then((response) => {
					ToastMessage(response.data.message, "s");
					setLoading(false);
					resetForm();
					setTimeout(() => {
						setIsRedirect(true);
					}, 3000);
				})
				.catch((error) => {
					setError(error.data.error);
					setLoading(false);
				});
		}
	};

	const resetForm = () => {
		setName("");
		setCouponCode("");
		setCouponType("");
		setAmount(0);
		setPercentage(0);
		SetDiscountUpto(0);
		setMinAmount(0);
		setUsePerPerson(0);
		setNoOfUses(0);
		setDescription("");
		setStartDate("");
		setEndDate("");
	};

	return (
		<div className="content-wrapper">
			{isRedirect && <Redirect to={{ pathname: `/admin/coupons` }} />}

			<div className="page-header">
				<h3 className="page-title"> Add New Coupon </h3>
			</div>

			<div className="col-lg-12 text-center">
				{error && (
					<div>
						{error.map((e) => (
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
							<form method="post" id="createCouponForm">
								<div className="row">
									<div className="col-sm-6">
										<div className="form-group required">
											<label htmlFor="name" className="control-label">Coupon Name</label>
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

										<div className="form-group required">
											<label htmlFor="coupon_code" className="control-label">Coupon Code</label>
											<input
												type="text"
												name="coupon_code"
												id="coupon_code"
												className="form-control cmn_input__2"
												value={couponCode || ""}
												onChange={(e) => setCouponCode(e.target.value)}
												required
											/>
										</div>

										<div className="form-group required">
											<label htmlFor="coupon_type" className="control-label">Coupon Type</label>
											<select
												name="coupon_type"
												className="form-control cmn_input__2"
												onChange={(e) => setCouponType(e.target.value)}
												required
												value={couponType}
											>
												<option value={""}>Select Type</option>
												<option value="1">Fixed</option>
												<option value="2">Percentage</option>
											</select>
										</div>

										{couponType == 1 && (
											<div className="form-group required">
												<label htmlFor="amount" className="control-label">Amount</label>
												<input
													type="text"
													name="amount"
													id="amount"
													className="form-control cmn_input__2"
													value={amount}
													onChange={(e) => setAmount(e.target.value)}
													required
												/>
											</div>
										)}

										{couponType == 2 && (
											<div className="form-group required">
												<label htmlFor="percentage" className="control-label">Percentage</label>
												<input
													type="text"
													name="percentage"
													id="percentage"
													className="form-control cmn_input__2"
													value={percentage}
													onChange={(e) => setPercentage(e.target.value)}
													required
												/>
											</div>
										)}

										{couponType == 2 && (
											<div className="form-group required">
												<label htmlFor="discount_upto" className="control-label">Discount Upto</label>
												<input
													type="text"
													name="discount_upto"
													id="discount_upto"
													className="form-control cmn_input__2"
													value={discountUpto || ""}
													onChange={(e) => SetDiscountUpto(e.target.value)}
													required
												/>
											</div>
										)}

										<div className="form-group required">
											<label htmlFor="min_purchase_amount" className="control-label">Minimum Purchase Amount</label>
											<input
												type="text"
												name="min_purchase_amount"
												id="min_purchase_amount"
												className="form-control cmn_input__2"
												value={minAmount || ""}
												onChange={(e) => setMinAmount(e.target.value)}
												required
											/>
										</div>
									</div>

									<div className="col-sm-6">
										<div className="form-group required">
											<label htmlFor="num_of_person_use" className="control-label">Number of per person usage</label>
											<input
												type="text"
												name="num_of_person_use"
												id="num_of_person_use"
												className="form-control cmn_input__2"
												value={usePerPerson || ""}
												onChange={(e) => setUsePerPerson(e.target.value)}
												required
											/>
										</div>

										<div className="form-group required">
											<label htmlFor="no_of_uses" className="control-label">Number of usage</label>
											<input
												type="text"
												name="no_of_uses"
												id="no_of_uses"
												className="form-control cmn_input__2"
												value={noOfUses || ""}
												onChange={(e) => setNoOfUses(e.target.value)}
												required
											/>
										</div>

										<div className="form-group required">
											<label htmlFor="start_date" className="control-label">Start Date</label>
											<DatePicker
												required={true}
												name={"start_date"}
												dateFormat="dd-MM-yyyy"
												selected={startDate ? moment(startDate).valueOf() : null}
												onChange={(date) => {
													setStartDate(moment(date).format("YYYY-MM-DD"));
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

										<div className="form-group required" >
											<label htmlFor="end_date" className="control-label">End Date</label>
											<DatePicker
												required={true}
												name={"end_date"}
												dateFormat="dd-MM-yyyy"
												selected={endDate ? moment(endDate).valueOf() : null}
												onChange={(date) => {
													setEndDate(moment(date).format("YYYY-MM-DD"));
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
												onChange={(e) => setDescription(e.target.value)}
												value={description}
											></textarea>
										</div>
									</div>
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
	);
};

export default AddCouponPage;
