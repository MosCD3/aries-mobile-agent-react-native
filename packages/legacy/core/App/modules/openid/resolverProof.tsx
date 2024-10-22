import { Agent, X509ModuleConfig } from '@credo-ts/core'
import { OpenID4VCIParam } from './resolver'

export async function withTrustedCertificate<T>(
  agent: Agent,
  certificate: string | null,
  method: () => Promise<T> | T
): Promise<T> {
  const x509ModuleConfig = agent.dependencyManager.resolve(X509ModuleConfig)
  const currentTrustedCertificates = x509ModuleConfig.trustedCertificates
    ? [...x509ModuleConfig.trustedCertificates]
    : []

  try {
    if (certificate) agent.x509.addTrustedCertificate(certificate)
    return await method()
  } finally {
    if (certificate) x509ModuleConfig.setTrustedCertificates(currentTrustedCertificates as [string])
  }
}

export const getCredentialsForProofRequest = async ({ agent, data, uri }: OpenID4VCIParam) => {
  const offerUri = uri
  if (!offerUri && data) {
    throw new Error('[getCredentialsForProofRequest] either data or uri must be provided')
  }

  agent.config.logger.info(`$$Receiving openid uri ${offerUri}`)

  const ss = encodeURIComponent(offerUri as string)
  agent.config.logger.info(`$$Receiving openid SS: ${ss}`)

  // Temp solution to add and remove the trusted certificate
  const resolved = await agent.modules.openId4VcHolder.resolveSiopAuthorizationRequest(
    'openid://?request_uri=https%3A%2F%2Fssi.dutchblockchaincoalition.org%2Fagent%2Fsiop%2Fdefinitions%2Fdbc2023%2Fauth-requests%2F1adbf237-ae5c-43c4-8d50-92267ec60447'
  )

  console.log('$$RESOLVEDDDDDDD:', JSON.stringify(resolved))

  //   if (!resolved.presentationExchange) {
  //     throw new Error('No presentation exchange found in authorization request.')
  //   }
}
