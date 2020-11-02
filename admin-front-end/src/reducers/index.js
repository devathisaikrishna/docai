import { combineReducers } from 'redux'

import { AuthReducers, LogoutReducers } from './AuthReducers'
import { AdminProfileReducers, AdminUserReducers } from './AdminUserReducers'
import { PlanServiceReducers } from './PlanServiceReducers'

export default combineReducers({
    AuthReducers,
    LogoutReducers,
    AdminProfileReducers,
    AdminUserReducers,
    PlanServiceReducers,
})
