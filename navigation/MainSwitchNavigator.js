
import { createSwitchNavigator, createAppContainer } from 'react-navigation'

import startScreen from '../Screens/StartScreen'
import AuthLoading from '../Screens/AuthLoading'
import Auth from '../Screens/Auth'
import UserSetup from '../Screens/UserSetup'
import AppDrawerNavigator from './MainDrawerNavigation'

const AppSwitchNavigator = createSwitchNavigator({
    AuthLoading: {
        screen: AuthLoading
    },
    startScreen: {
        screen: startScreen
    },
    UserSetup : {
        screen : UserSetup
    },
    Auth: {
        screen: Auth
    },
    App: {
        screen: AppDrawerNavigator
    }
})

export default createAppContainer(AppSwitchNavigator)
