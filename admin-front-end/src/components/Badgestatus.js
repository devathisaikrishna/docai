import React from 'react';

export const Badgestatus = (porps) =>{
    let sData = ["success", "Success", "active", "Active", "Activate"];
    let eData = ["Deactivated","Deactive","Cancelled","Inactive"];
    let wData = ["Pending","warning","Expired"];
    let cname='';
    let status=''
    
    if(sData.includes(porps.status)){
        cname = 'success';
        status = porps.status;
    }else if(eData.includes(porps.status)){
        cname = 'danger';
        status = porps.status;
    }else if(wData.includes(porps.status)){
        cname = 'warning';
        status = porps.status;
    }else{
        cname = 'info';
        status = porps.status?porps.status:"N/A";
    }
    
    return( 
    <span className={"badge badge-"+cname}>{status}</span>
        );
    
}