
import React from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ToastUndo = (props) => {
  let icon = 'icon';
  if (props.showType == 'e') {
    icon += ' icon-error-icons';
  } else if (props.showType == 's') {
    icon += ' icon-accept-approve1-ie';
  } else if (props.showType == 'w') {
    icon += ' icon-accept-warning2-ie';
  } else if (props.showType == 'i') {
    icon += ' icon-info';
  }

  let data = props.message != null && typeof (props.message) == 'string' && props.message != '' ? props.message.split('.,').join('.\n').split('\n').map((text, index) => (
    <React.Fragment key={`${text}-${index}`}>
      {text}
      <br />
    </React.Fragment>
  )) : props.message;

  let msgdata = (<p>{data}</p>);
  return (
    <div className="Toastify_content__">
      <h3>
        {msgdata}
        <i className={icon}></i>
      </h3>
    </div>
  );
}
ToastUndo.defaultProps = {
  message: '',
  showType: 'e'
};

export const ToastMessage = (msg, type, callbackOption) => {
  if (msg) {
    if (msg == undefined || (typeof msg == "string" && msg == "")) {
      return false;
    }
    toast.dismiss();
    let options = {
      position: toast.POSITION.TOP_CENTER,
      hideProgressBar: true
    };
    if (callbackOption != undefined && typeof callbackOption == "object" && callbackOption != null) {
      if (callbackOption.hasOwnProperty("close")) {
        options["onClose"] = callbackOption.close;
      }
      if (callbackOption.hasOwnProperty("open")) {
        options["onOpen"] = callbackOption.open;
      }
    }
    if (type == "s") {
      toast.success(<ToastUndo message={msg} showType={type} />, options);
    } else if (type == "e") {
      toast.error(<ToastUndo message={msg} showType={type} />, options);
    } else if (type == "w") {
      toast.warn(<ToastUndo message={msg} showType={type} />, options);
    } else if (type == "i") {
      toast.info(<ToastUndo message={msg} showType={type} />, options);
    } else {
      toast.error(<ToastUndo message={msg} showType={type} />, options);
    }
  }
};



