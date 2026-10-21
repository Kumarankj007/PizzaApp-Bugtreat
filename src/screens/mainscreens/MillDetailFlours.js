import {FlatList, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import FlourCard from '../../components/Cards/FlourCard';
import {print, widthResponse} from '../../Utilities/helperFunction';
import appColors from '../../Utilities/appColors';
import {useStyle} from '../../Utilities/styleSheet';
import {useDispatch} from 'react-redux';
import {setTitle} from '../../Redux/HeaderSlice';
import {useNavigation} from '@react-navigation/native';
import {FlourCardShimmer} from '../../Utilities/appShimmer';
import SpinLoader from '../../components/Loader/SpinLoader';

const MillDetailFlours = ({
  millTitle,
  flour,
  flourLoad = false,
  setStart,
  start,
}) => {
  const dispatch = useDispatch();
  const {commenStyle} = useStyle();
  const appColor = appColors();
  const separator = widthResponse ? 20 : 25;
  const Navigation = useNavigation();

  const numColumns = widthResponse ? 2 : 3;

  return (
    <View>
      {!flourLoad ? (
        flour?.flours &&
        flour?.flours.length > 0 && (
          <FlatList
            data={flour.flours}
            numColumns={numColumns}
            scrollEnabled={false}
            style={[commenStyle.container]}
            contentContainerStyle={{paddingVertical: widthResponse ? 15 : 20}}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => {
              return <View style={{marginBottom: separator}} />;
            }}
            onEndReached={() => {
              start == flour.start &&
                flour.page < flour.count &&
                setStart(Number(flour.limit) + Number(start));
            }}
            ListFooterComponent={() =>
              flour.page != flour.count && <SpinLoader />
            }
            renderItem={({item, index}) => {
              return (
                <FlourCard
                  key={index}
                  item={item}
                  index={index}
                  milltitle={millTitle}
                  numColumns={numColumns}
                  onPress={() => {
                    Navigation.navigate('flourDetail', {
                      Detail: item,
                      verify: 'mill',
                    });
                  }}
                  separator={separator}
                />
              );
            }}
          />
        )
      ) : (
        <FlourCardShimmer />
      )}
    </View>
  );
};

export default MillDetailFlours;

const styles = StyleSheet.create({});
