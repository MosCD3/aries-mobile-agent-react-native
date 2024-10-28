import React, { useState, forwardRef, Ref } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { CodeField, Cursor, useClearByFocusCell } from 'react-native-confirmation-code-field'
import Icon from 'react-native-vector-icons/MaterialIcons'

import { hitSlop, minPINLength } from '../../constants'
import { useTheme } from '../../contexts/theme'
import { testIdWithKey } from '../../utils/testable'
import InlineErrorText, { InlineMessageProps } from './InlineErrorText'
import { InlineErrorPosition } from '../../container-api'

interface PINInputProps {
  label?: string
  onPINChanged?: (PIN: string) => void
  testID?: string
  accessibilityLabel?: string
  autoFocus?: boolean
  inlineMessage?: InlineMessageProps
}

const PINInputComponent = (
  { label, onPINChanged, testID, accessibilityLabel, autoFocus = false, inlineMessage }: PINInputProps,
  ref: Ref<TextInput>
) => {
  // const accessible = accessibilityLabel && accessibilityLabel !== '' ? true : false
  const [PIN, setPIN] = useState('')
  const [showPIN, setShowPIN] = useState(false)
  const { t } = useTranslation()
  const { TextTheme, PINInputTheme } = useTheme()
  const cellHeight = 48
  const onChangeText = (value: string) => {
    onPINChanged && onPINChanged(value)
    setPIN(value)
  }
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value: PIN,
    setValue: onChangeText,
  })

  const style = StyleSheet.create({
    container: {
      flexDirection: 'column',
      marginBottom: 24,
    },
    codeFieldContainer: {
      flex: 1,
    },
    cell: {
      height: cellHeight,
      paddingHorizontal: 2,
      backgroundColor: PINInputTheme.cell.backgroundColor,
    },
    cellText: {
      ...TextTheme.headingThree,
      color: PINInputTheme.cellText.color,
      textAlign: 'center',
      lineHeight: cellHeight,
    },
    hideIcon: {
      paddingHorizontal: 10,
    },
  })
  const content = () => (
    <View style={style.labelAndFieldContainer}>
      <View style={[style.codeFieldRoot, { borderWidth: 1, borderColor: ColorPallet.brand.text }]}>
        <View style={style.codeFieldContainer}>
          <CodeField
            {...props}
            testID={testID}
            accessibilityLabel={accessibilityLabel}
            accessible
            value={PIN}
            rootStyle={style.codeFieldRoot}
            onChangeText={onChangeText}
            cellCount={minPINLength}
            keyboardType="numeric"
            textContentType="password"
            renderCell={({ index, symbol, isFocused }) => {
              let child: React.ReactNode | string = ''
              if (symbol) {
                child = showPIN ? symbol : '●' // Show or hide PIN
              } else if (isFocused) {
                child = <Cursor />
              }
              return (
                <View key={index} style={style.cell} onLayout={getCellOnLayoutHandler(index)}>
                  <Text style={style.cellText} maxFontSizeMultiplier={1}>
                    {child}
                  </Text>
                </View>
              )
            }}
            autoFocus={autoFocus}
            ref={ref}
          />
        </View>
        <TouchableOpacity
          style={style.hideIcon}
          accessibilityLabel={showPIN ? t('PINCreate.Hide') : t('PINCreate.Show')}
          accessibilityRole={'button'}
          testID={showPIN ? testIdWithKey('Hide') : testIdWithKey('Show')}
          onPress={() => setShowPIN(!showPIN)}
          hitSlop={hitSlop}
        >
          <Icon color={PINInputTheme.icon.color} name={showPIN ? 'visibility-off' : 'visibility'} size={30} />
        </TouchableOpacity>
      </View>
    </View>
  )

  const inlineMessageView = (props: InlineMessageProps) => (
    <InlineErrorText message={props.message} inlineType={props.inlineType} config={props.config} />
  )
  const inlineMessagePlaceholder = (placment: InlineErrorPosition) => {
    if (inlineMessage && inlineMessage.config.position === placment) {
      return inlineMessageView(inlineMessage)
    }
    //This is a fallback in case no position provided
    if (inlineMessage && placment === InlineErrorPosition.Above && !inlineMessage.config.position) {
      return inlineMessageView(inlineMessage)
    }
  }
  return (
    <View style={style.container}>
      {label && <Text style={[TextTheme.label, { marginBottom: 8 }]}>{label}</Text>}
      {inlineMessagePlaceholder(InlineErrorPosition.Above)}
      {content()}
      {inlineMessagePlaceholder(InlineErrorPosition.Below)}
    </View>
  )
}

const PINInput = forwardRef<TextInput, PINInputProps>(PINInputComponent)

export default PINInput
