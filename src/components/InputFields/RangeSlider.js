import {
  Keyboard,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import appColors from '../../Utilities/appColors';
import {useStyle} from '../../Utilities/styleSheet';
import {fontScalling, widthResponse} from '../../Utilities/helperFunction';
import {Icon} from '../../Utilities/icon';
import Tooltip from 'react-native-walkthrough-tooltip';
import CalcInput from './CalcInput';
import {appFont} from '../../Utilities/appFont';
import {Slider} from '@miblanchard/react-native-slider';
const RangeSlider = ({
  slideTitle,
  value,
  onChangeText = () => {},
  unitShow,
  unit,
  minimum,
  maximum,
  step,
  toolContent,
  noteText,
  note1,
  note2,
  note1MinRange = null,
  note1MaxRange = null,
  note2MinRange = null,
  note2MaxRange = null,
  maxCalc = false,
}) => {
  const appColor = appColors();
  const {commenStyle} = useStyle();
  const {styles} = pageStyle();
  const [tool, setTool] = useState(false);

  const width = 70;

  return (
    <View
      style={{
        marginBottom: widthResponse ? 15 : 20,
      }}>
      {/* titla and tooltip */}
      <View
        style={[
          commenStyle.hFlex,
          {
            marginBottom: widthResponse ? 3 : 6,
            position: 'relative',
          },
        ]}>
        {slideTitle && (
          <Text
            style={[
              commenStyle.sideHead,
              {fontSize: fontScalling(2.1), marginBottom: 0},
            ]}>
            {slideTitle}
          </Text>
        )}
        <TouchableOpacity
          style={{
            marginLeft: 8,
          }}
          onPress={() => setTool(true)}>
          <Icon
            ComponentName={'AntDesign'}
            name={'questioncircle'}
            color={appColor.black}
          />
        </TouchableOpacity>

        {/* tooltip */}
        <Tooltip
          arrowStyle={{
            elevation: 10,
            shadowColor: 'rgba(0,0,0,0.3)',
            zIndex: 2,
            marginTop: 2,
          }}
          contentStyle={{
            elevation: 10,
            shadowColor: 'rgba(0,0,0,0.5)',
            zIndex: 1,
            margin: 2,
            position: 'absolute',
            left: 0,
          }}
          tooltipStyle={{width: '100%'}}
          animated={Number(maximum)}
          // arrowSize={{ width: 16, height: 8 }}
          backgroundColor="transparent"
          isVisible={tool}
          content={
            <Text style={{color: appColor.Textlightblack}}>{toolContent}</Text>
          }
          placement="top"
          onClose={() => setTool(false)}
          useInteractionManager={true}
          topAdjustment={
            Platform.OS === 'android' ? -StatusBar.currentHeight : 0
          }>
          <Text style={{color: appColor.bgWhite}}>.</Text>
        </Tooltip>
      </View>

      {/* slider and input */}
      <View style={[commenStyle.hFlex]}>
        <View
          style={{
            flex: 1,
            marginRight: widthResponse ? 10 : 15,
            // backgroundColor:appColor.TextInputborderbg
          }}>
          {/* slider */}
          <Slider
            value={Number(value)}
            onValueChange={e =>
              onChangeText(e[0].toFixed(step == 0.01 ? 2 : step == 0.1 ? 1 : 0))
            } //@@
            minimumValue={Number(minimum)}
            maximumValue={Number(maximum)}
            step={Number(step)}
            trackClickable={false}
            maximumTrackTintColor={appColor.cardBack}
            minimumTrackTintColor={appColor.primary}
            thumbStyle={{
              backgroundColor: appColor.bgWhite,
              borderWidth: 4,
              width: 17,
              height: 17,
              borderColor: appColor.primary,
            }}
          />

          {/* label */}
          <View
            style={[
              commenStyle.hFlex,
              {
                justifyContent: 'space-between',
              },
            ]}>
            <Text style={[styles.label]}>
              {minimum} {unit}
            </Text>
            <Text style={[styles.label]}>
              {maximum} {unit}
            </Text>
          </View>
        </View>
        <CalcInput
          width={width}
          unitShow={unitShow}
          unit={unit}
          value={String(value)}
          onChangeText={onChangeText}
        />
      </View>

      {/* note 1 content */}
      {note1MinRange &&
        note1MaxRange &&
        (maxCalc
          ? value > note1MaxRange
          : value <= note1MinRange || value >= note1MaxRange) && (
          <View
            style={[
              {
                marginTop: widthResponse ? 10 : 15,
                flexDirection: 'row',
                alignItems: 'flex-start',
              },
            ]}>
            {noteText && (
              <View style={[commenStyle.hFlex]}>
                <Icon
                  ComponentName={'FontAwesome6'}
                  name={'circle-exclamation'}
                  color={appColor.primary}
                  size={13}
                />
                <Text
                  style={[
                    styles.label,
                    {
                      fontSize: fontScalling(1.8),
                      lineHeight: fontScalling(2),
                      color: appColor.ToastError,
                      marginLeft: 5,
                    },
                  ]}>
                  {noteText} :{' '}
                </Text>
              </View>
            )}

            <Text
              style={[
                styles.label,
                {
                  fontSize: fontScalling(1.8),
                  lineHeight: fontScalling(2),
                  flex: 1,
                },
              ]}>
              {' '}
              {note1}
            </Text>
          </View>
        )}

      {/* note 2 content */}
      {note2MinRange &&
        note2MaxRange &&
        (value <= note2MinRange || value >= note2MaxRange) && (
          <View
            style={[
              {
                marginTop: widthResponse ? 10 : 15,
                flexDirection: 'row',
                alignItems: 'flex-start',
              },
            ]}>
            {noteText && (
              <View style={[commenStyle.hFlex]}>
                <Icon
                  ComponentName={'FontAwesome6'}
                  name={'circle-exclamation'}
                  color={appColor.primary}
                  size={13}
                />
                <Text
                  style={[
                    styles.label,
                    {
                      fontSize: fontScalling(1.8),
                      lineHeight: fontScalling(2),
                      color: appColor.ToastError,
                      marginLeft: 5,
                    },
                  ]}>
                  {noteText} :{' '}
                </Text>
              </View>
            )}

            <Text
              style={[
                styles.label,
                {
                  fontSize: fontScalling(1.8),
                  lineHeight: fontScalling(2),
                  flex: 1,
                },
              ]}>
              {' '}
              {note2}
            </Text>
          </View>
        )}
    </View>
  );
};

export default RangeSlider;

const pageStyle = () => {
  const appColor = appColors();
  const styles = StyleSheet.create({
    label: {
      color: appColor.black,
      fontSize: fontScalling(1.6),
      fontFamily: appFont.lR,
      lineHeight: fontScalling(1.5),
    },
  });
  return {styles};
};
