import React from 'react'
import { View, StyleSheet, Text } from 'react-native'

import { useTheme } from '../../contexts/theme'
import { SvgProps } from 'react-native-svg'

export enum InlineErrorType {
  error,
  warning,
}

export interface InlineMessageProps {
  message: string
  inlineType: InlineErrorType
}

const InlineErrorText: React.FC<InlineMessageProps> = ({ message, inlineType }) => {
  const { InputInlineMessage } = useTheme()
  const style = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignContent: 'center',
      marginBottom: 5,
      paddingRight: 20,
    },
    icon: { marginRight: 4 },
  })

  const color =
    inlineType === InlineErrorType.warning
      ? InputInlineMessage.inlineWarningText.color
      : InputInlineMessage.inlineErrorText.color

  const props: SvgProps = { height: 16, width: 16, color: color, style: style.icon }

  return (
    <View style={style.container}>
      {inlineType === InlineErrorType.warning ? (
        <InputInlineMessage.InlineWarningIcon {...props} />
      ) : (
        <InputInlineMessage.InlineErrorIcon {...props} />
      )}
      <Text style={[InputInlineMessage.inlineErrorText]}>{message}</Text>
    </View>
  )
}

export default InlineErrorText
