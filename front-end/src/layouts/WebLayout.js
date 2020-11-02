import React from 'react';

import Header from "components/Header";
import Footer from "components/Footer";

import "assets/vendor/icofont/icofont.min.css"
import "assets/vendor/boxicons/css/boxicons.min.css"
import "assets/vendor/remixicon/remixicon.css"
// import "assets/vendor/venobox/venobox.css"
// import "assets/vendor/owl.carousel/assets/owl.carousel.min.css"
// import "assets/vendor/aos/aos.css"
import "assets/css/style.css"
import "assets/css/custom.css"
import "assets/css/icons/style_new.css"

function WebLayout(props) {
    const { children, page } = props;

    return (
        <div>
            <Header {...props} />
                {children}
            <Footer account_layout={props.smallFooter} />

            <a href="#" className="back-to-top"><i className="ri-arrow-up-line"></i></a>
            <div id="preloader"></div>
        </div>
    );
}

export default WebLayout;