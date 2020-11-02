import React from "react";

function AboutPage(props) {
	return (
		<>
			<main id="main">
				{/* <!-- ======= Breadcrumbs ======= --> */}
				<section id="breadcrumbs" className="breadcrumbs">
					<div className="container">
						<ol>
							<li>
								<a href="index.html">Home</a>
							</li>
							<li>About</li>
						</ol>
						<h2>About Us</h2>
					</div>
				</section>
				{/* <!-- End Breadcrumbs --> */}

				<section id="overview_sec" className="overview_sec">
					<div className="container">
						<h3 className="main_title text-center w-100">Company Overview</h3>

						<div className="row pt-3 pb-3">
							<div className="col-12 col-md-5">
								<img src={process.env.PUBLIC_URL + "/user/img/inner/com_over_1.png"} alt="" className="w-100" />
							</div>
							<div className="col-12 col-md-7">
								<div className="over_text">
									<h3 className="over_head">The Past</h3>
									<p className="over_descryp">
										Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text
										ever sinceLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard
										dummy text ever since
									</p>
									<p className="over_descryp">
										Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text
										ever since
									</p>
									<p className="over_descryp">
										Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text
										ever sinceLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard
										dummy text ever since
									</p>
								</div>
							</div>
						</div>

						<div className="row pt-5 pb-5">
							<div className="col-12 col-md-5 order-md-5">
								<img src={process.env.PUBLIC_URL + "/user/img/inner/com_over_2.png"} alt="" className="w-100" />
							</div>
							<div className="col-12 col-md-7">
								<div className="over_text">
									<h3 className="over_head">The Present</h3>
									<p className="over_descryp">
										Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text
										ever sinceLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard
										dummy text ever sinceLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
										industry's standard dummy text ever since
									</p>
								</div>
							</div>
						</div>

						<div className="row pt-5 pb-5">
							<div className="col-12 col-md-5">
								<img src={process.env.PUBLIC_URL + "/user/img/inner/com_over_3.png"} alt="" className="w-100" />
							</div>
							<div className="col-12 col-md-7">
								<div className="over_text">
									<h3 className="over_head">The Future</h3>
									<p className="over_descryp">
										Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text
										ever since
									</p>
									<p className="over_descryp">
										Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text
										ever since
									</p>
								</div>
							</div>
						</div>
					</div>
				</section>

				<section id="two_col_sec" className="two_col_sec">
					<img src={process.env.PUBLIC_URL + "/user/img/inner/dots.png"} alt="" className="dot_img" />
					<div className="column_1 bg_blue">
						<div className="mission_box">
							<div className="mssion_icon">
								<img src={process.env.PUBLIC_URL + "/user/img/inner/mission-icon.png"} alt="" className="w-100" />
							</div>
							<div className="content">
								<span className="head_">Our Mission</span>
								<p className="desc__">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
							</div>
						</div>

						<div className="mission_box mb-0">
							<div className="mssion_icon">
								<img src={process.env.PUBLIC_URL + "/user/img/inner/vision-icon.png"} alt="" className="w-100" />
							</div>
							<div className="content">
								<span className="head_">Our Vision</span>
								<p className="desc__">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
							</div>
						</div>
					</div>
					<div className="column_2">
						<h2 className="text-center">LOREM IPSUM IS A FREE TEXT</h2>
						<button className="btn cmn_btn">SEE MORE</button>
					</div>
				</section>

				<section id="numbers_sec" className="numbers_sec bg_yellow">
					<div className="container">
						<div className="row justify-content-center">
							<div className="col-12 col-lg-8">
								<div className="row">
									<div className="col-6 col-sm-3">
										<div className="num_wrappper">
											<h3 className="num_">200+</h3>
											<p className="title">COURSES</p>
										</div>
									</div>
									<div className="col-6 col-sm-3">
										<div className="num_wrappper">
											<h3 className="num_">1236+</h3>
											<p className="title">CERTIFIED STUDENTS</p>
										</div>
									</div>
									<div className="col-6 col-sm-3">
										<div className="num_wrappper">
											<h3 className="num_">50+</h3>
											<p className="title">PARTNERS</p>
										</div>
									</div>
									<div className="col-6 col-sm-3">
										<div className="num_wrappper">
											<h3 className="num_">10+</h3>
											<p className="title">LOCATIONS</p>
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

export default AboutPage;
