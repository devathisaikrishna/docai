import { combineReducers } from 'redux'

import { AuthUserReducers, LogoutUserReducers, UserProfileReducers } from './AuthUserReducers'
import { ApiKeyReducers } from './ApiKeyReducers'
import { ReportDataReducers } from './ReportReducers';
import { PlanReducers } from './PlanReducers';
import { CartReducers } from './CartReducers';
import { BlockUIReducers } from './BlockUIReducers';

export default combineReducers({
    AuthUserReducers,
    LogoutUserReducers,
    ApiKeyReducers,
    UserProfileReducers,
    ReportDataReducers,
    PlanReducers,
    CartReducers,
    BlockUIReducers,
})
