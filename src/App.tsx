import React from 'react'
import { connect, useDispatch } from 'react-redux'
import { ThemeProvider } from 'styled-components'
import { Route, Switch } from 'react-router-dom'

import { lightTheme, darkTheme } from './utils/global.theme'
import { GlobalStyles } from './global'
import { AppState } from 'store/configureStore'

import { Theme } from 'types/store/theme'
import { Client } from 'types/store/clients'
import { LIGHT } from 'utils/generalConstants'
import { ProtectedRouteHOC as ProtectedRoute } from 'utils/HOCs'

import Sidebar from 'layout/sidebar/Sidebar'
import { MainContainer } from 'components/cards'

import { SellsView, LoginView, ClientsView, ProductsView, ProvidersView, StatsView } from 'views'
import { fetchProductTypes, fetchBrands, fetchProducts, fetchProductFamilies } from 'store/actions/products.actions'
import { Alert } from 'components/utilities-components'

import { AlertReducer } from 'store/reducers/alertReducer'

interface ComponentProps {
  theme: Theme
  user: Client
  alert: AlertReducer
}

const App: React.FC<ComponentProps> = ({ theme, user, alert }) => {
  const dispatch = useDispatch()
  const isUser = !!user.id

  React.useEffect(() => {
    dispatch(fetchProductTypes())
    dispatch(fetchBrands())
    dispatch(fetchProductFamilies())

    dispatch(fetchProducts())
    // eslint-disable-next-line
  }, [])

  React.useEffect(() => {
    if (alert.showAlert)
    setTimeout(() => dispatch({ type: 'ALERT_UNSET_ALERT'}), 3500);
    // eslint-disable-next-line
  }, [alert.showAlert])

  return (
    <ThemeProvider theme={theme === LIGHT ? lightTheme : darkTheme}>
      {
        alert.showAlert && <Alert color={alert.color} message={alert.message} />
      }
      <Sidebar isUser={isUser} />
      <GlobalStyles />
      <MainContainer isUser={isUser}>
        <Switch>
          <Route exact path='/login' component={LoginView} />
          <ProtectedRoute isAuthenticated={isUser} exact path='/' component={SellsView} />
          <ProtectedRoute isAuthenticated={isUser} exact path='/clientes' component={ClientsView} />
          <ProtectedRoute isAuthenticated={isUser} exact path='/productos' component={ProductsView} />
          <ProtectedRoute isAuthenticated={isUser} exact path='/proveedores' component={ProvidersView} />
          <ProtectedRoute isAuthenticated={isUser} exact path='/estadisticas' component={StatsView} />
        </Switch>
      </MainContainer>
    </ThemeProvider>
  )
}

const mapStateToProps = (state: AppState) => ({
  theme: state.theme,
  user: state.user,
  alert: state.alert
})

export default connect(mapStateToProps)(App)
