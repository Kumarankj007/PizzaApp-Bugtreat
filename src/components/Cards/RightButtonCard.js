import React, {useState} from 'react';
import {Pressable, Text, View} from 'react-native';
import {useStyle} from '../../Utilities/styleSheet';
import appColors from '../../Utilities/appColors';
import {Icon} from '../../Utilities/icon';
import {SubTitleShimmer} from '../../Utilities/appShimmer';
import {fontScalling} from '../../Utilities/helperFunction';

const RightButtonCard = ({
  altStyle,
  textVal,
  btnVal,
  onPress = () => {},
  btnHover,
  iconComponent,
  iconName,
  iconSize,
  noCont = false,
  load,
}) => {
  const {commenStyle} = useStyle();
  const appColor = appColors();
  // const [btnHover, setBtnHover] = useState(false);
  return (
    <View
      style={[
        commenStyle.hFlex,
        !noCont ? commenStyle.container : null,
        {justifyContent: 'space-between'},
        altStyle,
      ]}>
      {/* text */}
      <Text
        style={[
          commenStyle.sideHead,
          {
            marginBottom: 0,
            fontSize: fontScalling(2),
            paddingRight: 7,
            flex: 1,
          },
        ]}>
        {!load ? textVal : <SubTitleShimmer />}
      </Text>
      {/* outline btn */}
      <Pressable
        style={[
          commenStyle.hFlex,
          {
            backgroundColor: btnHover ? appColor.bgBlack : appColor.bgWhite,
            elevation: btnHover ? 10 : 0,
            borderRadius: 15,
            borderWidth: 1,
            borderColor: btnHover
              ? 'transparent'
              : appColor.placeHolderTextDark,
            paddingHorizontal: 13,
            paddingVertical: 10,
          },
        ]}
        onPress={onPress}>
        <Icon
          ComponentName={iconComponent}
          name={iconName}
          size={iconSize}
          color={btnHover ? appColor.bgWhite : appColor.bgBlack}
        />
        <Text
          style={[
            commenStyle.authPara,
            {
              marginBottom: 0,
              marginLeft: 10,
              color: btnHover ? appColor.bgWhite : appColor.bgBlack,
            },
          ]}>
          {btnVal}
        </Text>
      </Pressable>
    </View>
  );
};

export default RightButtonCard;
