import {
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {useStyle} from '../../Utilities/styleSheet';
import appColors from '../../Utilities/appColors';
import {fontScalling, widthResponse} from '../../Utilities/helperFunction';
import Tooltip from 'react-native-walkthrough-tooltip';
import {Icon} from '../../Utilities/icon';
import {appFont} from '../../Utilities/appFont';

const CalcDrop = ({
  slideTitle,
  datas,
  value,
  placeholder,
  top = false,
  onChange = () => {},
  tooltip = false,
  toolContent,
}) => {
  const [drop, setDrop] = useState(false);
  const [tool, setTool] = useState(false);
  const appColor = appColors();
  const {commenStyle} = useStyle();

  return (
    <View
      style={{
        marginBottom: widthResponse ? 15 : 20,
        zIndex: 2,
      }}>
      {/* titla and tooltip */}
      <View
        style={[
          commenStyle.hFlex,
          {
            marginBottom: widthResponse ? 10 : 15,
            position: 'relative',
          },
        ]}>
        <Text
          style={[
            commenStyle.sideHead,
            {fontSize: fontScalling(2.1), marginBottom: 0},
          ]}>
          {slideTitle}
        </Text>
        {tooltip ? (
          <>
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
              //   animated={Number(maximum)}
              // arrowSize={{ width: 16, height: 8 }}
              backgroundColor="transparent"
              isVisible={tool}
              content={
                <Text style={{color: appColor.Textlightblack}}>
                  {toolContent}
                </Text>
              }
              placement="top"
              onClose={() => setTool(false)}
              useInteractionManager={true}
              topAdjustment={
                Platform.OS === 'android' ? -StatusBar.currentHeight : 0
              }>
              <Text style={{color: appColor.bgWhite}}>.</Text>
            </Tooltip>
          </>
        ) : null}
      </View>

      {/* drop down */}
      <View
        style={{
          position: 'relative',
          flex: 1,
        }}>
        <Pressable
          onPress={() => setDrop(!drop)}
          style={{
            backgroundColor: appColor.smokeBack, //
            borderRadius: 30,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 17,
            paddingVertical: 13,
          }}>
          <Text
            style={{
              flex: 1,
              fontSize: fontScalling(2),
              color: value ? appColor.black : appColor.placeHolderText, //
              fontFamily: appFont.lR,
              lineHeight: fontScalling(2.5),
            }}>
            {value ? value : placeholder}
          </Text>
          <Icon
            ComponentName={'AntDesign'}
            name={'caretdown'}
            color={appColor.black}
          />
        </Pressable>
        {drop && (
          <View
            style={[
              commenStyle.shadow,
              {
                backgroundColor: appColor.white,
                borderRadius: 10,
                position: 'absolute',
                top: top ? '' : widthResponse ? 50 : 70,
                bottom: top ? (widthResponse ? 50 : 70) : '',
                zIndex: 1,
                width: '100%',
                // overflow: 'hidden',
                height: datas?.length > 6 ? 150 : 'auto',
              },
            ]}>
            <ScrollView
              nestedScrollEnabled={true}
              // showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                borderRadius: 10,
                overflow: 'hidden',
              }}
              showsHorizontalScrollIndicator={false}>
              {datas?.map((item, index) => {
                return (
                  <TouchableHighlight
                    delayLongPress={2000}
                    onPress={() => {
                      setDrop(!drop);
                      onChange(item);
                    }}
                    key={index}
                    underlayColor={appColor.lightGreyLine}
                    style={{
                      padding: 10,
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        fontSize: fontScalling(2),
                        color: appColor.black,
                        fontFamily: appFont.lR,
                        flex: 1,
                        lineHeight: fontScalling(2.3),
                      }}>
                      {item}
                    </Text>
                  </TouchableHighlight>
                );
              })}
            </ScrollView>
          </View>
        )}
      </View>
    </View>
  );
};

export default CalcDrop;

const styles = StyleSheet.create({});
