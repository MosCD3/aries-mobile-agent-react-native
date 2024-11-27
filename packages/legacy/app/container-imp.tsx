import { BaseLogger } from '@credo-ts/core'
import { Container, TokenMapping } from '@hyperledger/aries-bifold-core'
import { DependencyContainer } from 'tsyringe'

export class AppContainer implements Container {
  private _container: DependencyContainer
  private log?: BaseLogger

  public constructor(bifoldContainer: Container, log?: BaseLogger) {
    this._container = bifoldContainer.container.createChildContainer()
    this.log = log
  }

  public get container(): DependencyContainer {
    return this._container
  }

  public init(): Container {
    // eslint-disable-next-line no-console
    this.log?.info(`Initializing App container`)
    // Here you can register any component to override components in core package
    // Example: Replacing button in core with custom button
    // this.container.registerInstance(TOKENS.COMP_BUTTON, Button)

    //Customizing Terms screen custom header
    /*
    this.container.registerInstance(TOKENS.OBJECT_ONBOARDING_CONFIG, {
      ...DefaultScreenOptionsDictionary,
      [Screens.Terms]: {
        ...DefaultScreenOptionsDictionary[Screens.Terms],
        headerShown: false,
      },
    })
    this.container.registerInstance(TOKENS.OBJECT_LAYOUT_CONFIG, {
      ...DefaultScreenLayoutOptions,
      [Screens.Terms]: {
        ...DefaultScreenLayoutOptions[Screens.Terms],
        customEdges: ['bottom'],
        safeArea: true,
        Header: () => (
          <View style={{ backgroundColor: 'red', height: 129, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: 'white' }}>Custom Header</Text>
          </View>
        ),
      },
    })
      */
    return this
  }

  public resolve<K extends keyof TokenMapping>(token: K): TokenMapping[K] {
    return this._container.resolve(token) as TokenMapping[K]
  }
  public resolveAll<K extends keyof TokenMapping, T extends K[]>(
    tokens: [...T]
  ): { [I in keyof T]: TokenMapping[T[I]] } {
    return tokens.map((key) => this.resolve(key)!) as { [I in keyof T]: TokenMapping[T[I]] }
  }
}
