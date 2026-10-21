import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import appColors from '../../Utilities/appColors'
import { widthResponse } from '../../Utilities/helperFunction'

const DarkBack = ({
    children,
    style
}) => {
    const appColor = appColors()
  return (
    <View 
        style={[
            
            {padding:widthResponse ? 20 : 25,
                backgroundColor:appColor.cardbg,
                flex:1

            },style]}
    >
      {children}
    </View>
  )
}

export default DarkBack

const styles = StyleSheet.create({})