import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { get_plan_options } from "actions/PlanServiceActions";
import { postData } from "service/Common";
import $ from "jquery";
import { ToastMessage } from "service/ToastMessage";

function AllocatePlanPopUp(props) {
	const [plan_id, setPlan_id] = useState("");
	const [loading, setLoading] = useState("");

	const dispatch = useDispatch();
	const PlanServiceReducers = useSelector((state) => state.AdminReducers.PlanServiceReducers);
	const { plans_options } = PlanServiceReducers;

	useEffect(() => {
		dispatch(get_plan_options());
	}, []);

	const submitHandler = (e) => {
		e.preventDefault();

		$("#allocate_plan").validate();

		if ($("#allocate_plan").valid() && !loading) {
			setLoading(true);
			postData("/api/admin/allocate_plan_to_user", { plan_id, user_id: props.user_id })
				.then((response) => {
					var data = response.data;
					setLoading(false);
					ToastMessage(data.message, "s");

					setTimeout(() => {
						props.onHide();
					}, 1000);
				})
				.catch((error) => {
					setLoading(false);
					ToastMessage(error.data.error, "e");
				});
		}
	};

	return (
		<Modal {...props} size="sm" aria-labelledby="contained-modal-title-vcenter" centered className={"allocate_plan_popup"}>
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-vcenter">Allocate Plan</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<form id="allocate_plan">
					<div className="form-group">
						<label>Plans</label>
						<select
							name="duration"
							className="form-control"
							className="form-control cmn_input__2"
							onChange={(e) => setPlan_id(e.target.value)}
							required
							value={plan_id}
						>
							<option value={""}>Select Duration</option>
							{plans_options.map((val, index) => (
								<option key={index + 1} value={val.id}>
									{val.name}
								</option>
							))}
						</select>
					</div>
				</form>
			</Modal.Body>
			<Modal.Footer>
				<button className="btn btn-success btn-rounded btn-fw btn-small mr-2" onClick={submitHandler}>
					{loading ? "Loading..." : "Allocate"}{" "}
				</button>
				<button className="btn btn-danger btn-rounded btn-fw btn-small" onClick={props.onHide}>
					Close
				</button>
			</Modal.Footer>
		</Modal>
	);
}

export default AllocatePlanPopUp;
