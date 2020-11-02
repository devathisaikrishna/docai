import React, { useState } from "react";
import { Link } from "react-router-dom";
import { postData } from "service/Common";
import React_Table from "components/React-Table/Table";
import { ToastMessage } from "service/ToastMessage";
import ConfirmationAlertBox from 'components/ConfirmationAlertBox';

function AdminUserListPage(props) {
	const columns = React.useMemo(() => [
		{
			Header: "ID",
			accessor: "id",
		},
		{
			Header: "Fname",
			accessor: "firstname",
		},
		{
			Header: "Lname",
			accessor: "lastname",
		},
		{
			Header: "Email",
			accessor: "email",
		},
		{
			Header: "Phone",
			accessor: "phone",
		},
		{
			Header: "Created",
			accessor: "created",
		},
		{
			Header: "Action",
			sortable: false,
			Cell:((info)=>{
				return (
				<>
					{/* <button type="button" className="btn btn-info btn-rounded btn-xs mr-2" title="Details"><i className="icon-eye"></i></button> */}
					{info.row.original.is_super_admin !== 1?
					<div>
						<Link className="btn btn-warning btn-rounded btn-xs mr-2" to={"admin_user_edit/"+info.row.original.id}>
							<i className="icon-pencil"></i>
						</Link>
						<button onClick={(e)=>deleteHandller(info.row.original.id)} type="button" className="btn btn-danger btn-rounded btn-xs mr-2" title="Remove"><i className="icon-trash"></i></button>
					</div>:''}
				</>
				)
			}),
		}
	]);

	// We'll start our table without any data
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [pageCount, setPageCount] = useState(0);
	const [search, setSearch] = useState("");
	const [searchData, setsearchData] = useState("");
	const [sortBy, setSortBy] = useState({});

	const fetchData = React.useCallback(({ pageSize, pageIndex, sortBy, globalFilter }) => {
		setLoading(true);

		let req = { page_size: pageSize, start: pageIndex, sort_by: sortBy, search: globalFilter };
		postData("/api/admin/admin_user_listing", req)
			.then((response) => {
				var res = response.data;
				setData(res.data);

				setPageCount(Math.ceil(parseInt(res.total) / pageSize));
				setLoading(false);
			})
			.catch((error) => {});
	}, []);

	const searchSubmitHandller=(e)=>{
		e.preventDefault();
		setsearchData(search);
	}

	const deleteHandller =(id)=>{
		ConfirmationAlertBox({title:"Delete Confirmation",message:"Are you sure want to delete ?"}).then((result)=>{
			if(result.status){
				postData("/api/admin/delete_admin_user", {user_id:id})
				.then((response) => {
					var res = response.data;
					if( res.message !== undefined ){
						ToastMessage(res.message,'s');
						fetchData({pageSize:10, pageIndex:0, sortBy:sortBy, globalFilter:search});
					}else{
						ToastMessage(res.error,'e');
					}
				}).catch((error)=>{
					ToastMessage(error.data.message,'e');
				})
				
			}
		})
		
	}

	return (
		<>
			<div className="content-wrapper">
				<div className="page-header">
					<h3 className="page-title"> Admins </h3>
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
								<form id="searchUserForm" onSubmit={searchSubmitHandller}>
								<div className="form-group search_icons_add">
									<input
										className="form-control form-control-lg"
										value={search}
										onChange={(e) => setSearch(e.target.value)}
										placeholder={"Search name"}
									/>
								</div>
								<div className="form-group">
									<Link
										className="btn ml-lg-auto download-button btn-success btn-sm my-1 my-sm-0"
										to={"/admin/register_admin"}
									>Create Admin</Link>
								</div>
								</form>
								<React_Table 
								columns={columns} 
								data={data}
								fetchData={fetchData} 
								loading={loading} 
								pageCount={pageCount} 
								globalFilter={searchData} 
								 />
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default AdminUserListPage;
