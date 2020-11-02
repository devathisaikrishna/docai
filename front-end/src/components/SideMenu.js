import React from 'react';
import { NavLink } from 'react-router-dom';
import { Nav } from 'reactstrap';
import PerfectScrollbar from 'react-perfect-scrollbar'

const ThemeRoutes = [
    { 
      path: '/dashboard', 
      name: 'Dashboard', 
      icon: 'ti-dashboard', 
      
    },
    {
      path: '/user/api_key',
      name: 'Api Key',
      icon: 'mdi mdi-comment-processing-outline',
     
    },
    {
      path: '/user/api_log',
      name: 'Api Logs',
      icon: 'fa fa-history',
     

    },
    {
      path: '/user/current_plan',
      name: 'Current Plan',
      icon: 'mdi mdi-toggle-switch',
      
    },
    {
      path: '/user/purchase_plan',
      name: 'Purchase Plan',
      icon: 'mdi mdi-credit-card-multiple',
     
    },
    {
      path: '/user/reports',
      name: 'Report',
      icon: 'fa fa-file',
    
    },
  ];
  
const Sidebar = (props) => {

    /*--------------------------------------------------------------------------------*/
    /*To Expand SITE_LOGO With Sidebar-Menu on Hover                                  */
    /*--------------------------------------------------------------------------------*/
    const expandLogo = () => {
        document.getElementById("logobg").classList.toggle("expand-logo");
    }
    /*--------------------------------------------------------------------------------*/
    /*Verifies if routeName is the one active (in browser input)                      */
    /*--------------------------------------------------------------------------------*/

    const activeRoute = (routeName) => {
        return props.location.pathname.indexOf(routeName) > -1 ? 'selected' : '';
    }

    return (
        <aside className="left-sidebar" id="sidebarbg" data-sidebarbg="skin6" onMouseEnter={expandLogo.bind(null)} onMouseLeave={expandLogo.bind(null)}>
            <div className="scroll-sidebar">
                <PerfectScrollbar className="sidebar-nav">
                    {/*--------------------------------------------------------------------------------*/}
                    {/* Sidebar Menus will go here                                                */}
                    {/*--------------------------------------------------------------------------------*/}
                    <Nav id="sidebarnav">
                        {ThemeRoutes.map((prop, key) => {
                            if (prop.redirect) {
                                return null;
                            }
                            else {
                                return (
                                    /*--------------------------------------------------------------------------------*/
                                    /* Adding Sidebar Item                                                            */
                                    /*--------------------------------------------------------------------------------*/
                                    <li className={activeRoute(prop.path) + (prop.pro ? ' active active-pro' : '') + ' sidebar-item'} key={key}>
                                        <NavLink to={prop.path} className="sidebar-link" activeClassName="active">
                                            <i className={prop.icon} />
                                            <span className="hide-menu">{prop.name}</span>
                                        </NavLink>
                                    </li>
                                );
                            }
                        })}
                    </Nav>
                </PerfectScrollbar>
            </div>
        </aside>
    );
}
export default Sidebar;
