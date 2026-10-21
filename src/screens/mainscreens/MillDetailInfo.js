import {Image, StyleSheet, Text, useWindowDimensions, View} from 'react-native';
import React from 'react';
import appColors from '../../Utilities/appColors';
import {useStyle} from '../../Utilities/styleSheet';
import {widthResponse} from '../../Utilities/helperFunction';
import WebView from 'react-native-webview';
import HtmlView from '../../components/HtmlElement/RenderHtml';
import MapView, {
  PROVIDER_GOOGLE,
  Marker,
  PROVIDER_DEFAULT,
} from 'react-native-maps';

const MillDetailInfo = ({data}) => {
  const appColor = appColors();
  const {commenStyle} = useStyle();
  const {width} = useWindowDimensions();

  const height = 350;
  const ASPECT_RATIO = width / height;

  const northeastLat = data.coordinates ? data.coordinates.nelat : 0;
  const southwestLat = data.coordinates ? data.coordinates.swlat : 0;
  const latDelta = northeastLat - southwestLat;
  const lngDelta = latDelta * ASPECT_RATIO;

  return (
    <View
      style={[
        commenStyle.container,
        {
          paddingVertical: widthResponse ? 10 : 15,
        },
      ]}>
      {/* mill image */}
      {/* {
          data?.millImg && 
          <Image
            source={{uri:data.millImg}}
            style={{
              width:'100%',
              height:widthResponse ? 200 : 250,
              marginVertical:widthResponse ? 15 : 20
            }}
            resizeMode='contain'
          />
        } */}
      {/* information */}
      {data?.millInfo && <HtmlView url={data.millInfo} />}

      {/* location title */}
      {data?.locTtl && (
        <Text style={[commenStyle.sideHead]}>{data.locTtl}</Text>
      )}

      {/* map view */}
      {data?.coordinates?.lat &&
        data?.coordinates?.lng &&
        data?.coordinates?.lat != '' &&
        data?.coordinates?.lng != '' && (
          <View
            style={{
              height: height,
              borderRadius: 15,
              overflow: 'hidden',
              borderWidth: 5,
              borderColor: appColor.bgWhite,
            }}>
            <MapView
              style={{width: '100%', height: '100%'}}
              region={{
                latitude: data.coordinates.lat,
                longitude: data.coordinates.lng,
                latitudeDelta: latDelta,
                longitudeDelta: lngDelta,
              }}
              initialRegion={{
                latitude: data.coordinates.lat,
                longitude: data.coordinates.lng,
                latitudeDelta: latDelta,
                longitudeDelta: lngDelta,
              }}
              zoomEnabled={true}
              provider={PROVIDER_GOOGLE}>
              <Marker
                style={{width: 50, height: 50}}
                coordinate={{
                  latitude: data.coordinates.lat,
                  longitude: data.coordinates.lng,
                  latitudeDelta: latDelta,
                  longitudeDelta: lngDelta,
                }}
                pinColor="red"
              />
            </MapView>
          </View>
        )}
    </View>
  );
};

export default MillDetailInfo;

const styles = StyleSheet.create({});
