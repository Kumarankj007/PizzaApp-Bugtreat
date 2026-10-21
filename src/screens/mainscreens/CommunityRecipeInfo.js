import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import appColors from '../../Utilities/appColors'
import { useStyle } from '../../Utilities/styleSheet'

const CommunityRecipeInfo = ({
    data
}) => {
    const appColor = appColors()
    const { commenStyle } = useStyle()
  return (
    <View
        style={[commenStyle.container]}
    >
      {
        data?.comment &&
        <Text
            style={[commenStyle.para]}
        >
            {data.comment}
        </Text> 
      }
    </View>
  )
}

export default CommunityRecipeInfo

const styles = StyleSheet.create({})