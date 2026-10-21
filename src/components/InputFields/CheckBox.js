import { Pressable, View } from "react-native";
import appColors from "../../Utilities/appColors";
import { widthResponse } from "../../Utilities/helperFunction";
import { Icon } from "../../Utilities/icon";


const CheckBox = ({
  checked,
  darkBack,
  onPress,
  color = false,
  altStyle = {},
  label,
  bordered
}) => {
  const appColor = appColors();
  return (
    <Pressable
      style={[{flexDirection: 'row'}, altStyle]}
      onPress={onPress}>
      <View
        style={{
          height: widthResponse ? 20 : 26,
          width: widthResponse ? 20 : 26,
          backgroundColor:  darkBack ? (!checked ? appColor.lightBlackBack : appColor.white) : bordered ? (!checked ? appColor.bgWhite : appColor.primary) : (!checked && appColor.cardbg) ,
          borderRadius: 2,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight:10    ,
          borderWidth:bordered ? 1 : 0,
          borderColor:checked ? "transparent" : appColor.borderColor,
          overflow:'hidden'
        }}>
        {checked && (
          <Icon
            ComponentName={'Entypo'}
            name={'check'}
            size={widthResponse ? 13 : 20}
            color={bordered ? appColor.white : appColor.primary}
          />
        )}
      </View>
        {label}
    </Pressable>
  );
};

export default CheckBox;
