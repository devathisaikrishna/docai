import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { postData } from "service/Common";
import $ from "jquery";
import { get_services, get_plan_details, clean_plan_details } from "actions/PlanServiceActions";
import { useDispatch, useSelector } from "react-redux";
import { ToastMessage } from "service/ToastMessage";
import { onlyAmount, onlyNumber } from "service/RegexMethods";

const createHistory = require("history").createHashHistory;
var history = createHistory();

function CreatePlanPage(props) {
	const dispatch = useDispatch();
	const PlanServiceReducers = useSelector((state) => state.AdminReducers.PlanServiceReducers);
	const { app_services, plan_details } = PlanServiceReducers;

	const [form_data, setFormData] = useState({
		name: "",
		num_of_hit: "",
		duration: "",
		month_price: "",
		year_price: "",
		services: [],
		plan_type: 1,
		trial_duration: 7,
	});

	const [isRedirect, setIsRedirect] = useState(false);

	const [loading, setLoading] = useState("");

	useEffect(() => {
		dispatch(get_services());

		if (props.match.params.id) {
			dispatch(get_plan_details(props.match.params.id));
		}

		return () => {
			dispatch(clean_plan_details());
		};
	}, []);

	useEffect(() => {
		if (app_services.length > 0) {
			setFormData({ ...form_data, services: app_services });
		}
		if (Object.keys(plan_details).length > 0) {
			let x = app_services;
			x.map((val, index) => {
				if (plan_details.services_ids.indexOf(val.id) != -1) {
					x[index].checked = true;
				}

				if (!val.parent_service_id && val.sub_services) {
					val.sub_services.map((ser, ser_index) => {
						if (plan_details.services_ids.indexOf(ser.id) != -1) {
							x[index]["sub_services"][ser_index].checked = true;
						} else {
							x[index]["sub_services"][ser_index].checked = false;
						}
					});
				}
			});

			setFormData({ ...form_data, ...plan_details, services: x });
		}
	}, [app_services, plan_details]);

	const submitHandler = (e) => {
		e.preventDefault();

		$("#register_admin").validate();

		if ($("#register_admin").valid() && !loading) {
			setLoading(true);
			postData("/api/admin/save_plan", form_data)
				.then((response) => {
					var data = response.data;
					setLoading(false);
					ToastMessage(data.message, "s");

					setTimeout(() => {
						setIsRedirect(true);
					}, 1000);
				})
				.catch((error) => {
					setLoading(false);
					ToastMessage(error.data.error, "e");
				});
		}
	};

	const onChangeServices = (e, index, parent_service_id, parent_index) => {
		let x = [...form_data.services];

		if (!parent_service_id) {
			x[index]["checked"] = e.target.checked;
		} else {
			x[parent_index]["sub_services"][index]["checked"] = e.target.checked;
		}
		setFormData({ ...form_data, services: x });
	};

	return (
		<>
			{isRedirect && <Redirect to="/admin/plans" />}
			<div className="content-wrapper">
				<div className="page-header">
					<h3 className="page-title"> {props.match.params.id ? "Update Plan" : "Create Plan"} </h3>
				</div>

				<div className="row">
					<div className="col-lg-12 grid-margin stretch-card">
						<div className="card">
							<div className="card-body">
								<div className="col-lg-4 mx-auto">
									<form id="register_admin" method="post">
										<div className="form-group required">
											<label className="label_01_1 control-label">Plan Name</label>
											<input
												type="text"
												className="form-control cmn_input__2"
												placeholder="Plan Name"
												name="name"
												onChange={(e) => setFormData({ ...form_data, name: e.target.value })}
												value={form_data.name || ""}
												required
											/>
										</div>
										<div className="form-group required">
											<label className="label_01_1 control-label">Number of Hit</label>
											<input
												type="text"
												className="form-control cmn_input__2"
												placeholder="Number of Hit"
												name="num_of_hit"
												onChange={(e) => setFormData({ ...form_data, num_of_hit: onlyNumber(e, form_data.num_of_hit) })}
												value={form_data.num_of_hit || ""}
												required
												maxLength="10"
												min="10"
											/>
										</div>

										<div className="form-group required">
											<label className="label_01_1 control-label" htmlFor="exampleFormControlSelect2">
												Plan Type
											</label>
											<div className="form-check pl-4">
												<input
													className="form-check-input"
													type="radio"
													name="plan_type"
													checked={form_data.plan_type == 1}
													onChange={(e) => setFormData({ ...form_data, plan_type: e.target.value })}
													id="inlineRadio1"
													value="1"
												/>
												<label className="form-check-label ml-0" htmlFor="inlineRadio1">
													Paid
												</label>
											</div>
											<div className="form-check pl-4">
												<input
													className="form-check-input"
													type="radio"
													name="plan_type"
													id="inlineRadio2"
													checked={form_data.plan_type == 2}
													onChange={(e) => setFormData({ ...form_data, plan_type: e.target.value })}
													value="2"
												/>
												<label className="form-check-label ml-0" htmlFor="inlineRadio2">
													Trial
												</label>
											</div>
										</div>

										{form_data.plan_type == 1 ? (
											<>
												<div className="form-group required">
													<label className="label_01_1 control-label">Monthly Price</label>
													<input
														type="text"
														className="form-control cmn_input__2"
														placeholder="Price"
														name="month_price"
														onChange={(e) => setFormData({ ...form_data, month_price: onlyAmount(e, form_data.month_price) })}
														value={form_data.month_price || ""}
														required
														autoComplete="none"
														maxLength="10"
														min="0"
													/>
												</div>

												<div className="form-group required">
													<label className="label_01_1 control-label">Yealy Price</label>
													<input
														type="text"
														className="form-control cmn_input__2"
														placeholder="Price"
														name="year_price"
														onChange={(e) => setFormData({ ...form_data, year_price: onlyAmount(e, form_data.year_price) })}
														value={form_data.year_price || ""}
														required
														autoComplete="none"
														maxLength="10"
														min="0"
													/>
												</div>
											</>
										) : (
											<div className="form-group required">
												<label className="label_01_1 control-label">Duration (In days)</label>
												<input
													type="text"
													className="form-control cmn_input__2"
													placeholder="Number of Hit"
													name="trial_duration"
													onChange={(e) => setFormData({ ...form_data, trial_duration: onlyNumber(e, form_data.trial_duration) })}
													value={form_data.trial_duration || ""}
													required
													maxLength="2"
													min="1"
												/>
											</div>
										)}

										<div className="form-group required">
											<label className="label_01_1 control-label">Services</label>
											<label htmlFor="Services[]" className="error CheckieError" style={{ display: "block", width: "100%" }}></label>

											{form_data.services.map((val, index) => (
												<div className="form-group " key={index + 1}>
													<div className="form-check pl-4">
														{val.is_service == 1 && (
															<input
																name="Services[]"
																className="form-check-input"
																type="checkbox"
																checked={val.checked || ""}
																onChange={(e) => onChangeServices(e, index, val.parent_service_id)}
																value={val.id}
																id={val.key_name}
																required
																data-msg-required="Please check at least one service"
															/>
														)}
														<label className="form-check-label ml-0" htmlFor={val.key_name}>
															{val.name}
														</label>
													</div>

													{val.sub_services && (
														<div className="pl-4">
															{val.sub_services.map((ser, ser_index) => (
																<div className="form-check" key={ser_index + 1}>
																	<input
																		name="Services[]"
																		className="form-check-input "
																		type="checkbox"
																		checked={ser.checked || ""}
																		onChange={(e) => onChangeServices(e, ser_index, ser.parent_service_id, index)}
																		id={ser.key_name}
																		value={ser.id}
																		required
																		data-msg-required="Please check at least one service"
																	/>
																	<label className="form-check-label  ml-0" htmlFor={ser.key_name}>
																		{ser.name}
																	</label>
																</div>
															))}
														</div>
													)}
												</div>
											))}
										</div>

										<div className="form-group">
											<button className="btn w-100 log-btn bg_blue" onClick={submitHandler}>
												{loading ? <span>Loading...</span> : "Save Plan"}
											</button>
										</div>
									</form>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default CreatePlanPage;
