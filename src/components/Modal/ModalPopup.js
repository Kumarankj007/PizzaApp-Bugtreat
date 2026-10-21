import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Modal from 'react-native-modal'
import appColors from '../../Utilities/appColors'
import { scrnWidth, widthResponse } from '../../Utilities/helperFunction'
import { Icon } from '../../Utilities/icon'

const ModalPopup = ({
    children,
    visible,
    style,
    white = true,
    onClosePress = () => {},
    onBackdropPress = () => {},
    onBackButtonPress = () => {}

}) => {
    const appColor = appColors()
    return (
        <Modal
            animationType="slide"
            onBackdropPress={onBackdropPress}
            backdropColor={appColor.overlayBg}
            backdropOpacity={1}
            transparent={true}
            isVisible={visible}
            onBackButtonPress={onBackButtonPress}
        >
            <View
                style={[{
                    backgroundColor: white ? appColor.bgWhite : null,
                    padding: widthResponse ? 20 : 25,
                    // paddingTop:widthResponse ? 30 : 40,
                    position:'relative',
                    borderRadius: 15,
                }, style]}
            >
                <Pressable
                    style={{
                        width:30,
                        height:30,
                        // backgroundColor:appColor.primaryLight,
                        position:'absolute',
                        right:10,
                        top:15,
                        zIndex:2,
                        justifyContent:'center',
                        alignItems:'center'
                    }}
                    onPress={onClosePress}
                >
                    <Icon
                        ComponentName={'Ionicons'}
                        name={'close'}
                        size={30}
                        color={appColor.black}
                    />
            </Pressable>
                {children}
            </View>
        </Modal>
    )
}

export default ModalPopup

const styles = StyleSheet.create({})