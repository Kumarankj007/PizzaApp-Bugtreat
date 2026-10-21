import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useStyle } from '../../Utilities/styleSheet'
import { Icon } from '../../Utilities/icon'
import { appFont } from '../../Utilities/appFont'
import appColors from '../../Utilities/appColors'
import { fontScalling } from '../../Utilities/helperFunction'

const TickList = ({
    list
}) => {
    const appColor = appColors()
    const { commenStyle } = useStyle()
    return (
        <>
            {list && 
                list.map((item,index) => {
                    return (
                        <View
                            key={index}
                            style={[commenStyle.hFlex, { marginBottom: 7}]}
                        >
                            <Image
                                source={require('../../../assets/images/tick.png')}
                                style={{
                                    marginRight: 10,
                                    width: 15,
                                    height: 15
                                }}
                            />
                            <Text style={{ fontFamily: appFont.lR, color: appColor.black, fontSize: fontScalling(1.9), lineHeight: fontScalling(1.9) }}>{item}</Text>
                        </View>
                    )
                })

            }
        </>
    )
}

export default TickList

const styles = StyleSheet.create({})