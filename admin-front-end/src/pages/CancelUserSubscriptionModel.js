import React, { useState, useEffect } from "react";
import { Modal } from 'react-bootstrap';
import { postData } from "service/Common"
import $ from "jquery";
import { ToastMessage } from "service/ToastMessage";


function CancelUserSubscriptionModel(props) {

  // const [optionType, setOptionType]=useState(0);
  const [loading, setLoading]=useState(false);
  
    const submitHandller=(e)=>{
      e.preventDefault();
      if($("#cancel_subscription").valid()) {    
          setLoading(true);
          postData("/api/admin/cancel_subscription_plan", {subscription_id:props.subscription_id})
          .then((response) => {
            setLoading(false);
            var res = response.data;
            ToastMessage(res.success, "s");
            props.close(true);
          })
          .catch((error) => {
            ToastMessage(error.data.description,"e");
            setLoading(false);
          });
      }
    }
    return (
      <>
        <Modal
          show={props.show}
          onHide={props.close}
          keyboard={false}
          backdrop="static"
          className="cancel_plan_popup"
        >
          <Modal.Header closeButton>
            <Modal.Title><strong>{props.title||'Model Title'}</strong></Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form id="cancel_subscription" name="cancel_subscription">
              <div className="noteline">
                <label><strong>Important</strong>: This action can not be undone.</label>
                <label>This subscription will move to cancelled state.</label>
              </div>
            
              <div className="form-group">
                <label htmlFor="chk_with">
                  <strong>Cancel at end if current billing cycle.</strong>
                </label>
              <p>Next payment will not be charged.</p>
              </div>
              
            </form>
          </Modal.Body>
          <Modal.Footer>
            <button className="btn btn-danger btn-rounded btn-fw btn-md mr-2" onClick={()=>props.close()}>
              No, Don't
            </button>
            <button className="btn btn-info btn-rounded btn-fw btn-md" onClick={submitHandller} disabled={loading?'disabled':''}>{loading?'Loading...':'Yes, Cancel'}</button>
          </Modal.Footer>
          
        </Modal>
        </>
    );
  }
export default CancelUserSubscriptionModel;