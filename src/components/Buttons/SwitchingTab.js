import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import appColors from '../../Utilities/appColors';
import { useStyle } from '../../Utilities/styleSheet';
import { appFont } from '../../Utilities/appFont';
import { fontScalling, widthResponse } from '../../Utilities/helperFunction';

const SwitchingTab = ({
    value,
    title,
    button1,
    button2,
    style,
    activeButton = () => {}
}) => {
    const appColor = appColors();
    const { commenStyle } = useStyle();
    const { styles } = useStyles()


    return (
        <View
            style={[commenStyle.hFlex,{
                justifyContent:'center'
            },style]}
        >
                <Pressable
                    onPress = {() => activeButton(1)}
                    style={[styles.tabPress,{
                        backgroundColor:value == 1 ? appColor.bgBlack : 'transparent',
                        borderColor:value == 1 ? "transparent" : appColor.bgBlack
                    }]}
                >
                    <Text
                        style={[styles.tabText,{
                            color:value == 1 ? appColor.white : appColor.black
                        }]}
                    >
                        {button1}
                    </Text>
                </Pressable>
                <Pressable
                    onPress = {() => activeButton(2)}
                    style={[styles.tabPress,{
                        backgroundColor:value == 2 ? appColor.bgBlack : 'transparent',
                        borderColor:value == 2 ? "transparent" : appColor.bgBlack
                    }]}
                >
                    <Text
                        style={[styles.tabText,{
                            color:value == 2 ? appColor.white : appColor.black
                        }]}
                    >
                        {button2}
                    </Text>
                </Pressable>
        </View>
    )
}

export default SwitchingTab

const useStyles = () => {
    const appColor = appColors();
    const styles = StyleSheet.create({
        tabPress: {
            paddingHorizontal: widthResponse ? 15 : 18,
            paddingVertical: widthResponse ? 8 : 11,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: appColor.borderColor,
            backgroundColor: appColor.bgWhite,
            marginRight: 7
        },
        tabText: {
            fontFamily: appFont.lB,
            fontSize: fontScalling(2),
            color: appColor.black
        }
    })

    return { styles }
}