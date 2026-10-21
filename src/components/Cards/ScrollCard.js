import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useStyle } from '../../Utilities/styleSheet'
import appColors from '../../Utilities/appColors'
import { widthResponse } from '../../Utilities/helperFunction'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const ScrollCard = ({
    children,
    scrollRef = null,
    refresh = false,
    onRefresh,
    editProfile
}) => {
    const { commenStyle } = useStyle()
    const appColor = appColors()
    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
            style={[commenStyle.scrollContainer,{
                paddingTop:0,
                paddingBottom:30
            }]}
            contentContainerStyle={{
                flex:1
            }}
            refreshControl={
                <RefreshControl
                    refreshing={refresh}
                    onRefresh={onRefresh}
                    colors={[appColor.primary]}
                    tintColor={appColor.primaryLight}
                    // style={{ backgroundColor: appColor.primaryLight }}
                />
            }
        >
            {editProfile ? 
                <KeyboardAwareScrollView
                    keyboardShouldPersistTaps={'always'}
                    scrollEnabled={true}
                    enableAutomaticScroll={true}
                    extraHeight={300}
                    showsVerticalScrollIndicator={false}
                    ref={scrollRef}
                    contentContainerStyle={{
                        paddingTop:widthResponse ? 15 : 20
                    }}
                >
                    {children}
                </KeyboardAwareScrollView> 
            :
                <>
                    {children}
                </>
            }
        </ScrollView>
    )
}

export default ScrollCard

const styles = StyleSheet.create({})