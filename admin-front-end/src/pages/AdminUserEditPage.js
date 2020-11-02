import React, { useState, useEffect } from 'react';
import { postData } from "service/Common"
import $ from "jquery";
import { useDispatch, useSelector } from "react-redux";
import { getAdminUserbyid } from "actions/AdminUserActions";
import { ToastMessage } from "service/ToastMessage";


function AdminUserEditPage(props) {

    const dispatch = useDispatch();
    const AdminReducers = useSelector((state) => {return state.AdminReducers.AdminUserReducers});
    const { getUserInfo,getUserInfoFail } = AdminReducers;

    const [id, setId] = useState("");
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    // const [password, setPassword] = useState("");
    //const [accountType, setAccountType] = useState("");
    //const [organisationName, setOrganisationName] = useState("");
    const [loading, setLoading] = useState("");

    const submitHandler = (e) => {
        e.preventDefault();

        $("#edit_admin_user").validate();

        if ($("#edit_admin_user").valid() && !loading) {
            setLoading(true);
            var req = { id, firstname, lastname, email, phone };
            postData("/api/admin/update_admin_user", req)
                .then((response) => {
                    var data = response.data;
                    ToastMessage(data.message,'s');
                    setLoading(false);
                    dispatch(getAdminUserbyid(id));
                })
                .catch((error) => {
                    ToastMessage(error.data.error,'e');
                    setLoading(false);
                });
        }
    };


    useEffect(()=>{
        if(props.match.params.id){
            let userid=props.match.params.id;
            dispatch(getAdminUserbyid(userid));
            setLoading(true);
        }
    },[]);

    useEffect(()=>{
        if(getUserInfo){
            setLoading(false);
            setId(getUserInfo.id);
            setFirstname(getUserInfo.firstname);
            setLastname(getUserInfo.lastname);
            setEmail(getUserInfo.email);
            setPhone(getUserInfo.phone);
        }
        if(getUserInfoFail){
            ToastMessage(getUserInfoFail,"e");
            setLoading(false);
            props.history.push('/admin/admin_user_list')
        }
    },[getUserInfo,getUserInfoFail]);

    return (
        <>
            <div className="content-wrapper">
                <div className="page-header">
                    <h3 className="page-title"> Edit Admin </h3>
                    {/* <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="#">Tables</a></li>
                            <li className="breadcrumb-item active" aria-current="page">Basic tables</li>
                        </ol>
                    </nav> */}
                </div>

                <div className="row justify-content-center">
                    <div className="col-lg-6 grid-margin stretch-card">
                        <div className="card">
                            <div className="card-body">
                                <form id="edit_admin_user" method="post">
                                    <div className="form-group">
                                        <label>First Name</label>
                                        <input
                                            type="text"
                                            className="form-control cmn_input__2"
                                            placeholder="First Name"
                                            name="fistname"
                                            onChange={(e) => setFirstname(e.target.value)}
                                            value={firstname || ""}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Last Name</label>
                                        <input
                                            type="text"
                                            className="form-control cmn_input__2"
                                            placeholder="Last Name"
                                            name="lastname"
                                            onChange={(e) => setLastname(e.target.value)}
                                            value={lastname || ""}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Email</label>
                                        <input
                                            type="email"
                                            className="form-control cmn_input__2"
                                            placeholder="Email"
                                            name="email"
                                            onChange={(e) => setEmail(e.target.value)}
                                            value={email || ""}
                                            required
                                            data-rule-email={true}
                                            autoComplete="none"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Phone</label>
                                        <input
                                            type="text"
                                            className="form-control cmn_input__2"
                                            placeholder="Phone"
                                            name="phone"
                                            onChange={(e) => setPhone(e.target.value)}
                                            value={phone || ""}
                                            required
                                            data-rule-phonenumber={true}
                                            autoComplete="none"
                                        />
                                    </div>
                                                                        
                                    <div className="form-group">
                                        <button className="btn w-100 log-btn bg_blue" onClick={submitHandler} disabled={loading?'disabled':''}>
                                            {loading ? <span>Loading...</span> : "Update"}
                                        </button>
                                    </div>

                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AdminUserEditPage;