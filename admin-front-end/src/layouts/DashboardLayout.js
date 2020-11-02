import React from 'react';

//plugins:css
import simple_line_icons from 'assets/css/simple-line-icons/css/simple-line-icons.css'
import flag_icon from 'assets/css/flag-icon-css/css/flag-icon.min.css'
import {vendor_bundle} from 'assets/css/vendor.bundle.base.css'

// Plugin css for this page
import daterangepicker from 'assets/css/daterangepicker/daterangepicker.css'
import chartist from 'assets/css/chartist/chartist.min.css'

//Layout styles
import {style_sheet} from 'assets/css/style.css'
import {custom_sheet} from 'assets/css/custom.css'
import "assets/css/icons/style_new.css"

// js
// import 'assets/js/vendor.bundle.base.js'

import Header from 'components/Header'
import Footer from 'components/Footer'
import SideMenu from 'components/SideMenu'



function LoginLayout(props) {
    const { children } = props
    return (
        <>
            <div className="container-scroller">
                {/* <!-- header nav bar --> */}
                <Header {...props} />

                <div className="container-fluid page-body-wrapper">
                    {/* Side Menu */}
                    <SideMenu {...props} />
                    {/* <!-- partial --> */}
                    <div className="main-panel">

                        {children}

                        {/* <!-- footer --> */}
                        <Footer {...props} />
                    </div>
                    {/* <!-- main-panel ends --> */}
                </div>
                {/* <!-- page-body-wrapper ends --> */}
            </div>
        </>
    );
}

export default LoginLayout;