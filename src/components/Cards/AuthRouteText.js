import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useStyle } from '../../Utilities/styleSheet'
import appColors from '../../Utilities/appColors'

const AuthRouteText = ({
    onPress,
    label,
    text
}) => {
    const {commenStyle} = useStyle()
    const appColor = appColors()
  return (
    <View 
        style={[commenStyle.authNavContainer]}>
        <Text style={[commenStyle.authNavText]}>{label}</Text>
        <Pressable onPress={onPress}>
        <Text style={[commenStyle.authNavText,commenStyle.authNavUnderline,{color:appColor.primary,marginLeft:5}]}>{text}</Text>
        </Pressable>
    </View>
  )
}

export default AuthRouteText

const styles = StyleSheet.create({})