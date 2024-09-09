import { render } from '@testing-library/react-native'
import React from 'react'

import { AuthContext } from '../../App/contexts/auth'
import { StoreProvider, defaultState } from '../../App/contexts/store'
import PINEnter from '../../App/screens/PINEnter'
import { testIdWithKey } from '../../App/utils/testable'
import authContext from '../contexts/auth'
import { ContainerProvider } from '../../App/container-api'
import { MainContainer } from '../../App/container-impl'
import { container } from 'tsyringe'

describe('displays a PIN Enter screen', () => {
  const main = new MainContainer(container.createChildContainer()).init()

  test('PIN Enter renders correctly', () => {
    const tree = render(
      <ContainerProvider value={main}>
        <StoreProvider
          initialState={{
            ...defaultState,
          }}
        >
          <AuthContext.Provider value={authContext}>
            <PINEnter setAuthenticated={jest.fn()} />
          </AuthContext.Provider>
        </StoreProvider>
      </ContainerProvider>
    )
    expect(tree).toMatchSnapshot()
  })

  test('PIN Enter renders correctly when logged out message is present', async () => {
    const tree = render(
      <ContainerProvider value={main}>
        <StoreProvider
          initialState={{
            ...defaultState,
            lockout: {
              displayNotification: true,
            },
          }}
        >
          <AuthContext.Provider value={authContext}>
            <PINEnter setAuthenticated={jest.fn()} />
          </AuthContext.Provider>
        </StoreProvider>
      </ContainerProvider>
    )
    const textNotice = await tree.findByText('PINEnter.LockedOut')
    expect(textNotice).not.toBeNull()
    expect(tree).toMatchSnapshot()
  })

  test('PIN Enter button exists', async () => {
    const tree = render(
      <ContainerProvider value={main}>
        <StoreProvider
          initialState={{
            ...defaultState,
          }}
        >
          <AuthContext.Provider value={authContext}>
            <PINEnter setAuthenticated={jest.fn()} />
          </AuthContext.Provider>
        </StoreProvider>
      </ContainerProvider>
    )
    const EnterButton = await tree.getByTestId(testIdWithKey('Enter'))
    expect(EnterButton).not.toBeNull()
  })
})
