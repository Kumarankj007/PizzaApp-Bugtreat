import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { appFont } from '../../Utilities/appFont'
import appColors from '../../Utilities/appColors'
import { useStyle } from '../../Utilities/styleSheet'
import { fontScalling, widthResponse } from '../../Utilities/helperFunction'
import { Icon } from '../../Utilities/icon'

const Used = ({
    value,
    style,
    text
}) => {
    const appColor = appColors()
    const { commenStyle } = useStyle()
    return (
        <View style={[commenStyle.hFlex, { marginRight: 10 }, style]}>
            <Icon
                ComponentName={'FontAwesome'}
                name={'group'}
                color={appColor.primary}
                size={widthResponse ? 14 : 19}
            />
            <Text
                style={[commenStyle.authSubButton, {
                    fontFamily: appFont.lR,
                    fontSize: fontScalling(1.5),
                    color: appColor.black,
                    marginLeft:4
                }]}>
                {text && text} {' '}
                <Text
                    style={{
                        fontFamily: appFont.lB
                    }}
                >
                    ({value})

                </Text>
            </Text>
        </View>
    )
}

export default Used

const styles = StyleSheet.create({})