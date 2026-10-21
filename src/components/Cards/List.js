import { FlatList, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useStyle } from '../../Utilities/styleSheet'
import appColors from '../../Utilities/appColors'
import { Icon } from '../../Utilities/icon'
import { fontScalling, widthResponse } from '../../Utilities/helperFunction'

const List = ({
    data,
    scrollEnabled = false,
    style
}) => {

    const { commenStyle } = useStyle()
    const appColor = appColors()
  return (
    <View 
    style={[{
        marginBottom: widthResponse ? 15 : 20

    },style]}>
        <FlatList
            data={data}
            scrollEnabled={scrollEnabled}
            ItemSeparatorComponent={() => <View style={{height:fontScalling(1)}}/>}
            renderItem={({item , index}) => {
                return (
                    <View style={[commenStyle.hFlex,{alignItems:'flex-start'}]} key={index}>
                        <Icon
                            color={appColor.black}
                            size={18}
                            ComponentName={'Feather'}
                            name={'chevron-right'}
                        />
                        <Text style={[commenStyle.para,{marginBottom:0}]}>{item}</Text>
                    </View>
                )
            }}
        />
    </View>
  )
}

export default List

const styles = StyleSheet.create({})