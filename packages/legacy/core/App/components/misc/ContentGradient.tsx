import React from 'react'
import { View, StyleSheet } from 'react-native'
import Svg, { Defs, Rect, Stop } from 'react-native-svg'

type ContentGradientProps = {
  backgroundColor: string
  height?: number
}

/**
 * To be used in a relative position controlsContainer that is below (and not in) scrollview content
 */
const ContentGradient: React.FC<ContentGradientProps> = ({ backgroundColor, height = 30 }) => {
  const id = 'gradient'

  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      height,
      width: '100%',
      top: -height,
    },
  })

  return (
    <View style={styles.container}>
      <Svg height={`${height}`} width="100%" style={StyleSheet.absoluteFill}>
        <Defs>
          <View>
            <Stop offset="0%" stopColor={backgroundColor} stopOpacity={0} />
            <Stop offset="100%" stopColor={backgroundColor} stopOpacity={1} />
          </View>
        </Defs>
        <Rect height={`${height}`} width="100%" fill={`url(#${id})`} />
      </Svg>
    </View>
  )
}

export default ContentGradient
