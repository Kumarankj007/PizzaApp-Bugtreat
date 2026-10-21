import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useStyle} from '../../Utilities/styleSheet';
import appColors from '../../Utilities/appColors';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import {widthResponse} from '../../Utilities/helperFunction';
import HtmlView from '../../components/HtmlElement/RenderHtml';

export default FlourDetailInfo = ({data}) => {
  const {commenStyle} = useStyle();
  const {styles} = pageStyle();
  const appColor = appColors();

  return (
    <View style={[commenStyle.container]}>
      <View style={{marginBottom: widthResponse ? 15 : 20}}>
        {data?.flourInfo && <HtmlView url={data.flourInfo} />}
      </View>
      {/* table */}
      {data?.specTable?.title && (
        <Text style={[commenStyle.sideHead]}>{data.specTable.title}</Text>
      )}
      <View
        style={{
          width: '100%',
          borderRadius: widthResponse ? 20 : 25,
          overflow: 'hidden',
          backgroundColor: appColor.bgWhite,
          paddingBottom: 5,
        }}>
        {data?.specTable?.thead &&
          data.specTable.thead.col1 &&
          data.specTable.thead.col2 && (
            <Table
              keyValue={data.specTable.thead.col1}
              pairValue={data.specTable.thead.col2}
              head
            />
          )}
        {data?.specTable?.row1 &&
          data.specTable.row1.col1 &&
          data.specTable.row1.col2 && (
            <Table
              keyValue={data.specTable.row1.col1}
              pairValue={data.specTable.row1.col2}
              border
            />
          )}
        {data?.specTable?.row2 &&
          data.specTable.row2.col1 &&
          data.specTable.row2.col2 && (
            <Table
              keyValue={data.specTable.row2.col1}
              pairValue={data.specTable.row2.col2}
              border
            />
          )}
        {data?.specTable?.row3 &&
          data.specTable.row3.col1 &&
          data.specTable.row3.col2 && (
            <Table
              keyValue={data.specTable.row3.col1}
              pairValue={data.specTable.row3.col2}
              border
            />
          )}
        {data?.specTable?.row4 &&
          data.specTable.row4.col1 &&
          data.specTable.row4.col2 && (
            <Table
              keyValue={data.specTable.row4.col1}
              pairValue={data.specTable.row4.col2}
            />
          )}
      </View>
    </View>
  );
};

const Table = ({keyValue, pairValue, head, border}) => {
  const {commenStyle} = useStyle();
  const {styles} = pageStyle();
  const appColor = appColors();
  return (
    <View
      style={{
        borderBottomWidth: border ? 1 : 0,
        borderColor: appColor.TextInputborderbg,
      }}>
      <View
        style={[
          commenStyle.hFlex,
          {
            padding: widthResponse ? 15 : 20,
            paddingHorizontal: widthResponse ? 20 : 30,
            marginVertical: 1,
            justifyContent: 'space-between',
            backgroundColor: head ? appColor.bgBlack : appColor.bgWhite,
            borderRadius: widthResponse ? 20 : 25,
          },
        ]}>
        {keyValue && (
          <Text
            style={[
              commenStyle.checkLabel,
              {color: head ? appColor.textWhite : appColor.textBlack},
            ]}>
            {keyValue}
          </Text>
        )}
        {pairValue && (
          <Text
            style={[
              commenStyle.checkLabel,
              {color: head ? appColor.textWhite : appColor.textBlack},
            ]}>
            {pairValue}
          </Text>
        )}
      </View>
    </View>
  );
};

const pageStyle = () => {
  const appColor = appColors();
  const styles = StyleSheet.create({
    paragraph: {
      color: appColor.textBlack,
      marginBottom: 15,
    },
  });
  return {styles};
};
