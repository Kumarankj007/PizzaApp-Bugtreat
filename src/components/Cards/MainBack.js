import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useRef } from 'react'
import { useStyle } from '../../Utilities/styleSheet'
import appColors from '../../Utilities/appColors'
import { widthResponse } from '../../Utilities/helperFunction'

const MainBack = ({
    children,
    containerstyle,
    scrollRef = null,
    refresh = false,
    onRefresh,
    verticalSpace = true,
    container = true

}) => {
    const Ref = useRef(scrollRef)
    const { commenStyle } = useStyle()
    const appColor = appColors()
  return (
    <View style={[container && commenStyle.container,commenStyle.rootPage]}>
      <ScrollView
        ref={Ref}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
            paddingVertical:verticalSpace ? widthResponse ? 20 :25 : 0
        }}  
        refreshControl={
            <RefreshControl
                refreshing={refresh}
                onRefresh={onRefresh}   
                colors={[appColor.primary]}
                // style={{backgroundColor:appColor.primaryLight}}
            />
        }
      >
        <View style={[{flex:1},containerstyle]}>
            {children}
        </View>
      </ScrollView>
    </View>
  )
}

export default MainBack

const styles = StyleSheet.create({})