import React from 'react';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

function ConfirmationAlertBox(options) {
    var default_options = {
        title: "Are you sure?",
        message: "You want to archive this item",
        confirm_label: "Confirm",
        cancel_label: "Cancel",
    }

    var op = { ...default_options, ...options }

    return new Promise((resolve, reject) => {

        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <div className='custom-ui'>
                        <h2>{op.title}</h2>
                        <p>{op.message}</p>
                        <button onClick={() => {
                            onClose();
                            resolve({ status: false });
                        }}
                        className={"btn btn-danger btn-rounded btn-sm mr-2"}
                        >{op.cancel_label}</button>

                        <button
                            onClick={() => {
                                resolve({ status: true });
                                onClose();
                            }}
                            className={"btn btn-success btn-rounded btn-sm"}
                        >{op.confirm_label}</button>
                    </div>
                );
            }
        });

    })
}

export default ConfirmationAlertBox;