import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import appColors from '../../Utilities/appColors'
import { useStyle } from '../../Utilities/styleSheet'
import { fontScalling, widthResponse } from '../../Utilities/helperFunction'
import { appFont } from '../../Utilities/appFont'

const Usp = ({
    text
}) => {

    const appColor = appColors()
    const { commenStyle } = useStyle()
    return (
        <View
            style={[commenStyle.hFlex, {
                padding : widthResponse ? 9 : 14,
                backgroundColor: appColor.bgBlack,
                borderRadius:7,
                marginBottom:10,
                marginRight:10
            }]}
        >
            <View
                style={{
                    justifyContent:'center',
                    alignItems:'center',
                    backgroundColor:appColor.bgWhite,
                    width : widthResponse ? 20 : 35,
                    height : widthResponse ? 20 : 35,
                    borderRadius:50,
                    marginRight:7
                }}
            >
                <View
                    style={{
                        width : 10,
                        height : 6,
                        borderColor : appColor.bgBlack,
                        borderLeftWidth : 2,
                        borderBottomWidth: 2,
                        transform:[{
                            rotate : '310deg'
                        }]
                    }}
                />
            </View>
            <Text
                style={{
                    fontFamily: appFont.lB,
                    fontSize: fontScalling(1.7),
                    lineHeight: fontScalling(2.8),
                    color: appColor.white,
                }}
            >
                {text}
            </Text>
        </View>
    )
}

export default Usp

const styles = StyleSheet.create({})