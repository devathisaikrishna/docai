import React, { useState } from "react";


import { postData } from "service/Common";
import $ from "jquery";
import SimpleMap from "../hoc/GoogleMap/SimpleMap";

function ContactPage(props) {
	const [contact, setContact] = useState({ name: "", email: "", phone: "", message: "" });
	const [loading, setLoading] = useState(false);
	const [responseMessage, setresponseMessage] = useState({});

	const submitHandller = (e) => {
		e.preventDefault();
		if ($("#contactForm").valid() && !loading) {
			setresponseMessage({});
			setLoading(true);
			postData("/api/user/contact", contact)
				.then((response) => {
					var data = response.data;
					setresponseMessage({msg:data.success,type:"success"});
					setLoading(false);
					setTimeout(() => {
						setresponseMessage({});
					}, 10000);
					setContact({ name: "", email: "", phone: "", message: "" });
				})
				.catch((error) => {
					setresponseMessage({msg:error.data.error,type:"danger"});
					setLoading(false);
					setTimeout(() => {
						setresponseMessage({});
					}, 10000);
				});
		}
	};

	return (
		<>
			<main id="main">
				{/* <!-- ======= Breadcrumbs ======= --> */}
				<section id="breadcrumbs" className="breadcrumbs">
					<div className="container">
						<ol>
							<li>
								<a href="/">Home</a>
							</li>
							<li>Contact</li>
						</ol>
						<h2>Contact Us</h2>
					</div>
				</section>
				{/* <!-- End Breadcrumbs --> */}

				<section id="contact_form_section" className="contact_form_section">
					<div className="container">
						<div className="row">
							<div className="col-12 col-md-4">
								<h3 className="main_title">Drop us a line!!</h3>
								{responseMessage.msg!==undefined?
								<div className={"alert alert-"+responseMessage.type}>
									{responseMessage.msg}
								  </div>
								:''}
								<form id="contactForm">
									<div className="form-group">
										<label htmlFor="name" className="contorl-label">
											Name <span className="text-danger">*</span>
										</label>
										<input
											type="text"
											id="name"
											name="name"
											onChange={(e) => setContact({ ...contact, name: e.target.value })}
											value={contact.name || ""}
											className="form-control cmn_input__"
											placeholder="Name"
											required
										/>
									</div>
									<div className="form-group">
										<label htmlFor="email" className="contorl-label">
											Email <span className="text-danger">*</span>
										</label>
										<input
											type="text"
											id="email"
											name="email"
											onChange={(e) => setContact({ ...contact, email: e.target.value })}
											value={contact.email || ""}
											className="form-control cmn_input__"
											placeholder="Email"
											data-rule-email={true}
											required
										/>
									</div>
									<div className="form-group">
										<label htmlFor="phone" className="contorl-label">
											Phone <span className="text-danger">*</span>
										</label>
										<input
											type="text"
											id="phone"
											name="phone"
											onChange={(e) => setContact({ ...contact, phone: e.target.value })}
											value={contact.phone || ""}
											className="form-control cmn_input__"
											placeholder="Phone Number"
											data-rule-required={true}
											data-rule-phonenumber={true}
										/>
									</div>
									<div className="form-group">
										<label htmlFor="message" className="contorl-label">
											Message <span className="text-danger">*</span>
										</label>
										<textarea
											id="message"
											name="message"
											onChange={(e) => setContact({ ...contact, message: e.target.value })}
											value={contact.message || ""}
											className="form-control cmn_input__"
											placeholder="Your Query/Request"
											required
										></textarea>
									</div>
									<button onClick={submitHandller} disabled={loading ? "disabled" : ""} className="btn cmn_btn bg_yellow">
										{loading ? "Loading..." : "Submit"}
									</button>
								</form>
							</div>

							<div className="col-md-1 d-none d-md-block"></div>

							<div className="col-12 col-md-6 col-lg-6">
								<h3 className="main_title">
									<p className="mb-0">Or</p> You Can Also Mail Us
								</h3>
								<div className="contact_method">
									<div className="method">
										<h3 className="main_title no_after">For General Queries or Partneship</h3>
									</div>
									<div className="method">
										<h6>EMAIL</h6>
										<span>support@Company.com</span>
										<h6>CONTACT NUMBER</h6>
										<span className="mb-0">+91-9110730114</span>
									</div>
								</div>

								<div className="contact_method">
									<div className="method">
										<h3 className="main_title no_after">
											For Media <p className="mb-0">And Press</p>
										</h3>
									</div>
									<div className="method">
										<h6>EMAIL</h6>
										<span>training@Company.com</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				<section id="location_section" className="location_section contact_form_section">
					<div className="container">
						<div className="row">
							<div className="col-12">
								<h3 className="main_title">You can simply visit us. You are always welcome!!!</h3>
								<div className="row align-items-center">
									<div className="col-12 col-md-4">
										<h5>Address</h5>
										<span>
											Company Name <br />
											2-92/4, <br />
											Peace House- 4th Floor, <br />
											JNTU Rd, Khanamet, <br />
											HITEC City, <br />
											Berlin
										</span>
									</div>
									<div className="col-12 col-md-8">
										<div className="location_img" id="map_canvas">
											{/* <GoogleMapComponent isMarkerShown={false} /> */}
											<SimpleMap />
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				<section id="feedback_sec" className="feedback_sec bg_yellow">
					<div className="container">
						<div className="row justify-content-center">
							<div className="col-12 col-md-8">
								<div className="row">
									<div className="col-12 col-md-6 d-flex justify-content-center">
										<div className="mb-3">
											<h4 className="account_">Know More About Company</h4>
										</div>
									</div>

									<div className="col-12 col-md-6 d-flex justify-content-center dot_pos">
										<img src={process.env.PUBLIC_URL + "assets/img/inner/dots.png"} alt="" className="dots_img" />
										<div className="btn_part">
											<button className="btn call_btn">About Us</button>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
			</main>
			{/* <!-- End #main --> */}
		</>
	);
}

export default ContactPage;
