import React from "react";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

const ConfirmationAlertBox = (options) => {
	const default_options = {
		title: "Are you sure?",
		message: "You want to archive this item",
		confirm_label: "Confirm",
		cancel_label: "Cancel",
	};

	const op = { ...default_options, ...options };

	return new Promise((resolve, reject) => {
		confirmAlert({
			customUI: ({ onClose }) => {
				return (
					<div className="custom-ui">
						<h1>{op.title}</h1>
						<p>{op.message}</p>
						<button
							onClick={() => {
								resolve({ status: true });
								onClose();
							}}
							className={"btn btn-success btn-rounded btn-fw"}
						>
							{op.confirm_label}
						</button>
					</div>
				);
			},
		});
	});
};

export default ConfirmationAlertBox;
