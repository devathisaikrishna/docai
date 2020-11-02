import React, { useEffect, useState } from "react";
import { postData } from "service/Common";
import { useDispatch, useSelector } from "react-redux";
import { getProfileData } from "actions/AdminUserActions";
import $ from 'jquery';
import { ToastMessage } from "service/ToastMessage";

function ProfilePage(props) {

    const dispatch = useDispatch();
    const AdminReducers = useSelector((state) => {return state.AdminReducers.AdminProfileReducers});
    const { getUserProfile } = AdminReducers;

	const [ProfileData, setProfileData] = useState({firstname:'',lastname:'',email:'',phone:''});
	const [loading, setLoading] = useState(true);
     
    useEffect(()=>{
        dispatch(getProfileData());
    },[]);
    useEffect(()=>{
        if(getUserProfile){
            setProfileData(getUserProfile);
            setLoading(false);
        }
    },[getUserProfile]);


	const submitHandller = (e) =>{
        e.preventDefault();
        if($("#profileForm").valid() && !loading){        
            setLoading(true);
            let req = ProfileData;
            postData("/api/admin/profile", req)
            .then((response) => {
                var res = response.data;
                dispatch(getProfileData());
                ToastMessage(res.message, "s");
                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
                ToastMessage(error.data.error, "e");
            });
        }
	}

	return (
		<>
			<div className="content-wrapper">
				<div className="page-header">
					<h3 className="page-title"> My Profile</h3>
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
                                        <form id={'profileForm'}>
                                            <div className={'form-group label_01_1'}>
                                                <label htmlFor="firstname" className="contorl-label">First Name</label>
                                                <input 
                                                type="text" 
                                                name="firstname" 
                                                onChange={(e)=>setProfileData({...ProfileData,firstname:e.target.value})} 
                                                value={ProfileData.firstname||''} 
                                                placeholder="First Name" 
                                                data-rule-required={true}
                                                maxLength={180}
                                                className="form-control"/>
                                            </div>
                                        
                                            <div className={'form-group label_01_1'}>
                                                <label htmlFor="lastname" className="contorl-label">Last Name</label>
                                                <input 
                                                type="text" 
                                                name="lastname" 
                                                onChange={(e)=>setProfileData({...ProfileData,lastname:e.target.value})} 
                                                value={ProfileData.lastname||''}
                                                data-rule-required={true}
                                                maxLength={180}
                                                placeholder="Last Name" 
                                                className="form-control"/>
                                            </div>
                                            <div className={'form-group label_01_1'}>
                                                <label htmlFor="email" className="contorl-label">Email</label>
                                                <input 
                                                type="text" 
                                                name="email" 
                                                onChange={(e)=>setProfileData({...ProfileData,email:e.target.value})} 
                                                value={ProfileData.email||''}
                                                data-rule-required={true}
                                                data-rule-email={true}
                                                maxLength={180}
                                                placeholder="xyz@example.com" 
                                                className="form-control"/>
                                            </div>
                                        
                                            <div className={'form-group label_01_1'}>
                                                <label htmlFor="phone" className="contorl-label">Phone</label>
                                                <input 
                                                type="text" 
                                                name="phone" 
                                                onChange={(e)=>setProfileData({...ProfileData,phone:e.target.value})} 
                                                value={ProfileData.phone||''}
                                                data-rule-required={true}
                                                data-rule-phonenumber={true}
                                                maxLength={18}
                                                placeholder="+91xxxxxxxxxx" 
                                                className="form-control"/>
                                            </div>
                                            <button type="submit" className="btn btn-info btn-lg btn-block" onClick={submitHandller} disabled={loading?'disabled':''}>{loading?'Please wait...':'Update'}</button>
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

export default ProfilePage;