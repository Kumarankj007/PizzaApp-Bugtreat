import React from 'react';
import {TouchableNativeFeedback, View} from 'react-native';
import appColors from '../../Utilities/appColors';

export default Touchable = ({
  parentStyle,
  childStyle,
  children,
  onPress = () => {},
  backColor,
}) => {
  const appColor = appColors();
  return (
    <View
      style={[
        {
          overflow: 'hidden',
        },
        parentStyle,
      ]}>
      <TouchableNativeFeedback
        onPress={onPress}
        background={TouchableNativeFeedback.Ripple(
          backColor ? backColor : appColor.greyBg,
          false,
        )}>
        <View
          style={[
            {
              padding: 10,
            },
            childStyle,
          ]}>
          {children}
        </View>
      </TouchableNativeFeedback>
    </View>
  );
};
