import React, { useState } from "react";
import { postData } from "service/Common";
import $ from 'jquery';
import { ToastMessage } from "service/ToastMessage";

function UpdatePassword(props) {

	const [passwordData, setPasswordData] = useState({currentPassword:'',newPassword:'',confirmPassword:''});
	const [loading, setLoading] = useState(false);
    
    
	const submitHandller = (e) =>{
        e.preventDefault();
        if($("#updatePasswordForm").valid()){
            setLoading(true);
            let req = passwordData;
            postData("/api/admin/update_password", req)
            .then((response) => {
                var res = response.data;
                ToastMessage(res.message,'s');
                setLoading(false);
                setPasswordData({currentPassword:'',newPassword:'',confirmPassword:''});
            })
            .catch((error) => {
                setLoading(false);
                ToastMessage(error.data.error,'e');
            });
        }
	}

	return (
		<>
			<div className="content-wrapper">
				<div className="page-header">
					<h3 className="page-title"> Update Password</h3>
					{/* <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="#">Tables</a></li>
                            <li className="breadcrumb-item active" aria-current="page">Basic tables</li>
                        </ol>
                    </nav> */}
				</div>

				<div className="row">
					<div className="col-lg-12 grid-margin stretch-card">
						<div className="card">
                            <div className="card-body">
                                <div className="row justify-content-center">
                                    <div className="col-md-5">
                                        <form id={'updatePasswordForm'} name={'updatePasswordForm'}>
                                            <div className={'form-group label_01_1'} >
                                                <label htmlFor="currentPass" className="contorl-label">Current Password</label>
                                                <input 
                                                type="password" 
                                                id="currentPassword" 
                                                name="currentPassword" 
                                                onChange={(e)=>setPasswordData({...passwordData,currentPassword:e.target.value})} 
                                                value={passwordData.currentPassword||''} 
                                                placeholder="Current Password" 
                                                data-rule-required={true}
                                                maxLength={50}
                                                className="form-control"/>
                                            </div>
                                        
                                            <div className={'form-group label_01_1'} >
                                                <label htmlFor="newPassword" className="contorl-label">New Password</label>
                                                <input 
                                                type="password"
                                                id="newPassword" 
                                                name="newPassword" 
                                                onChange={(e)=>setPasswordData({...passwordData,newPassword:e.target.value})} 
                                                value={passwordData.newPassword||''}
                                                data-rule-required={true}
                                                data-rule-notequalto={'#currentPassword'}
                                                maxLength={50}
                                                placeholder="New Password" 
                                                className="form-control"/>
                                            </div>
                                            <div className={'form-group label_01_1'} >
                                                <label htmlFor="confirmPassword" className="contorl-label">Confirm Password</label>
                                                <input 
                                                type="password" 
                                                name="confirmPassword" 
                                                onChange={(e)=>setPasswordData({...passwordData,confirmPassword:e.target.value})} 
                                                value={passwordData.confirmPassword||''}
                                                data-rule-required={true}
                                                data-rule-equalto={'#newPassword'}
                                                maxLength={50}
                                                placeholder="Confirm Password" 
                                                className="form-control"/>
                                            </div>
                                            <button type="submit" name="submit" className="btn btn-info btn-lg btn-block" onClick={submitHandller} disabled={loading?'disabled':''}>{loading?'Please wait...':'Update'}</button>
                                        </form>
								    </div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default UpdatePassword;