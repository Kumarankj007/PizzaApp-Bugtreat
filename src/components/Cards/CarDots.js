import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { widthResponse } from '../../Utilities/helperFunction'
import appColors from '../../Utilities/appColors'
import { useStyle } from '../../Utilities/styleSheet'

const CarDots = ({
    datas,
    currentIndex,
    activeButtonWidth
}) => {

    const appColor = appColors()
    const { commenStyle } = useStyle()
    return (
        <View
            style={[commenStyle.hFlex, {
                marginTop: widthResponse ? 15 : 20,
                justifyContent: 'center'
            }]}
        >
            {
                datas.map((item, index) => (
                    <View
                        key={index}
                        style={{
                            width: currentIndex == index ? activeButtonWidth ? activeButtonWidth : 25 : 10,
                            height: 10,
                            borderRadius: 20,
                            marginRight: 4,
                            backgroundColor: currentIndex == index ? appColor.bgBlack : appColor.borderColor
                        }}
                    />
                ))
            }

        </View>
    )
}

export default CarDots

const styles = StyleSheet.create({})