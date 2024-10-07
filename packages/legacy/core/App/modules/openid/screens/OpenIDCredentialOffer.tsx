import React from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { DeliveryStackParams, Screens, TabStacks } from '../../../types/navigators'
import { getCredentialForDisplay } from '../display'
import { SafeAreaView } from 'react-native-safe-area-context'
import CommonRemoveModal from '../../../components/modals/CommonRemoveModal'
import { ModalUsage } from '../../../types/remove'
import { useState } from 'react'
import { DeviceEventEmitter, FlatList, StyleSheet, Text, View } from 'react-native'
import { TextTheme } from '../../../theme'
import { useTranslation } from 'react-i18next'
import Button, { ButtonType } from '../../../components/buttons/Button'
import { testIdWithKey } from '../../../utils/testable'
import RecordHeader from '../../../components/record/RecordHeader'
import RecordFooter from '../../../components/record/RecordFooter'
import { useTheme } from '../../../contexts/theme'
import OpenIDCredentialCard from '../components/OpenIDCredentialCard'
import { buildFieldsFromOpenIDTemplate } from '../utils/utils'
import RecordField from '../../../components/record/RecordField'
import { BifoldError } from '../../../types/error'
import { EventTypes } from '../../../constants'
import { useAgent } from '@credo-ts/react-hooks'
import { storeCredential } from '../resolver'
import CredentialOfferAccept from '../../../screens/CredentialOfferAccept'
import RecordRemove from '../../../components/record/RecordRemove'

export enum OpenIDCredScreenMode {
  offer,
  details,
}

type OpenIDCredentialDetailsProps = StackScreenProps<DeliveryStackParams, Screens.OpenIDCredentialDetails>

const OpenIDCredentialDetails: React.FC<OpenIDCredentialDetailsProps> = ({ navigation, route }) => {
  const { credential, screenMode } = route.params
  const credentialDisplay = getCredentialForDisplay(credential)
  const { display, attributes } = credentialDisplay
  const fields = buildFieldsFromOpenIDTemplate(attributes)
  const { t } = useTranslation()
  const { ColorPallet } = useTheme()
  const { agent } = useAgent()

  const [declineModalVisible, setDeclineModalVisible] = useState(false)
  const [buttonsVisible, setButtonsVisible] = useState(true)
  const [acceptModalVisible, setAcceptModalVisible] = useState(false)

  const styles = StyleSheet.create({
    headerTextContainer: {
      paddingHorizontal: 25,
      paddingVertical: 16,
    },
    headerText: {
      ...TextTheme.normal,
      flexShrink: 1,
    },
    footerButton: {
      paddingTop: 10,
    },
  })

  const toggleDeclineModalVisible = () => setDeclineModalVisible(!declineModalVisible)

  const handleDeclineTouched = async () => {
    toggleDeclineModalVisible()
    navigation.getParent()?.navigate(TabStacks.HomeStack, { screen: Screens.Home })
  }

  const handleAcceptTouched = async () => {
    try {
      if (!agent) {
        return
      }
      await storeCredential(agent, credential)
      setAcceptModalVisible(true)
    } catch (err: unknown) {
      setButtonsVisible(true)
      const error = new BifoldError(t('Error.Title1025'), t('Error.Message1025'), (err as Error)?.message ?? err, 1025)
      DeviceEventEmitter.emit(EventTypes.ERROR_ADDED, error)
    }
  }

  const handleRemove = () => {
    console.log('$$Remove cred')
  }

  const footerButton = (
    title: string,
    buttonPress: () => void,
    buttonType: ButtonType,
    testID: string,
    accessibilityLabel: string
  ) => {
    return (
      <View style={styles.footerButton}>
        <Button
          title={title}
          accessibilityLabel={accessibilityLabel}
          testID={testID}
          buttonType={buttonType}
          onPress={buttonPress}
          disabled={!buttonsVisible}
        />
      </View>
    )
  }

  const header = () => {
    return (
      <>
        {screenMode === OpenIDCredScreenMode.offer && (
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerText} testID={testIdWithKey('HeaderText')}>
              <Text>{display.issuer.name || t('ContactDetails.AContact')}</Text>{' '}
              {t('CredentialOffer.IsOfferingYouACredential')}
            </Text>
          </View>
        )}

        {credential && (
          <View style={{ marginHorizontal: 15, marginBottom: 16 }}>
            <OpenIDCredentialCard credentialDisplay={credentialDisplay} />
          </View>
        )}
      </>
    )
  }

  const footer = () => {
    const paddingHorizontal = 24
    const paddingVertical = 16
    const paddingBottom = 26
    return (
      <View style={{ marginBottom: 50 }}>
        {screenMode === OpenIDCredScreenMode.offer ? (
          <View
            style={{
              paddingHorizontal: paddingHorizontal,
              paddingVertical: paddingVertical,
              paddingBottom: paddingBottom,
              backgroundColor: ColorPallet.brand.secondaryBackground,
            }}
          >
            {footerButton(
              t('Global.Accept'),
              handleAcceptTouched,
              ButtonType.Primary,
              testIdWithKey('AcceptCredentialOffer'),
              t('Global.Accept')
            )}
            {footerButton(
              t('Global.Decline'),
              toggleDeclineModalVisible,
              ButtonType.Secondary,
              testIdWithKey('DeclineCredentialOffer'),
              t('Global.Decline')
            )}
          </View>
        ) : (
          <>
            <View
              style={{
                backgroundColor: ColorPallet.brand.secondaryBackground,
                marginTop: paddingVertical,
                paddingHorizontal,
                paddingVertical,
              }}
            >
              <Text testID={testIdWithKey('IssuerName')}>
                <Text style={[TextTheme.title]}>{t('CredentialDetails.IssuedBy') + ' '}</Text>
                <Text style={[TextTheme.normal]}>{display.issuer.name || t('ContactDetails.AContact')}</Text>
              </Text>
            </View>
            <RecordRemove onRemove={handleRemove} />
          </>
        )}
      </View>
    )
  }

  const body = () => {
    return (
      <FlatList
        data={fields}
        keyExtractor={({ name }, index) => name || index.toString()}
        renderItem={({ item: attr, index }) => (
          <RecordField
            field={attr}
            hideFieldValue={false}
            shown={true}
            hideBottomBorder={index === fields.length - 1}
          />
        )}
        ListHeaderComponent={<RecordHeader>{header()}</RecordHeader>}
        ListFooterComponent={footer ? <RecordFooter>{footer()}</RecordFooter> : null}
      />
    )
  }

  return (
    <SafeAreaView style={{ flexGrow: 1 }} edges={['bottom', 'left', 'right']}>
      {body()}
      {screenMode === OpenIDCredScreenMode.offer && (
        <>
          <CredentialOfferAccept visible={acceptModalVisible} credentialId={''} confirmationOnly={true} />
          <CommonRemoveModal
            usage={ModalUsage.CredentialOfferDecline}
            visible={declineModalVisible}
            onSubmit={handleDeclineTouched}
            onCancel={toggleDeclineModalVisible}
          />
        </>
      )}
    </SafeAreaView>
  )
}

export default OpenIDCredentialDetails
