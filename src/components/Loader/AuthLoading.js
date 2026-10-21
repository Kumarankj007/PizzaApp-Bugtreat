import { Animated, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { scrnHeight, scrnWidth, widthResponse } from '../../Utilities/helperFunction'
import appColors from '../../Utilities/appColors'
import { Icon } from '../../Utilities/icon'
import spinner from '../AnimatedStyle/Spinner'

const AuthLoading = () => {
    const appColor = appColors()
    const spin = spinner('clock');
  return (
    <Animated.View
        style={{
            alignItems:'center',
            marginTop:widthResponse ? 30 : 50,
            transform:[{rotate : spin}]
        }}
    >
      <Icon
        ComponentName={'Fontisto'}
        name={'spinner'}
        size={40}
        color={appColor.primary}
      />
    </Animated.View>
  )
}

export default AuthLoading

const styles = StyleSheet.create({})