import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import appColors from '../../Utilities/appColors'
import { useStyle } from '../../Utilities/styleSheet'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { scrnWidth } from '../../Utilities/helperFunction'

const AuthBack = ({
  children,
  login,
  scrollRef,
  auth = false
}) => {
  const appColor = appColors()
  const { commenStyle } = useStyle()

  const image = login ? require('../../../assets/images/pizza.png') : require('../../../assets/images/tomatoPizza.png')
  return (
    <View style={{ flex: 1, position: 'relative' ,backgroundColor:appColor.white}}>
      {
        auth &&

        <Image source={image}
        // resizeMode='contain'
        style={{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: scrnWidth / 2,
          height: scrnWidth / 4,
          // backgroundColor:appColor.TextInputborderbg,
        }}
      />}
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps={'always'}
        scrollEnabled={true}
        enableAutomaticScroll={true}
        extraHeight={300}
        ref={scrollRef}
        contentContainerStyle={[commenStyle.authContainer, { backgroundColor:'transparent', paddingBottom: 100, zIndex: 10 }]}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </KeyboardAwareScrollView>
    </View>
  )
}

export default AuthBack

const styles = StyleSheet.create({})