// import LinearGradient from 'react-native-linear-gradient';
import {Skeleton} from '@rneui/themed';
import {ScrollView, StyleSheet, View} from 'react-native';
import {widthResponse} from './helperFunction';

export const HeadTitleShimmer = () => (
  <Skeleton
    width={170}
    height={22}
    style={[styles.backStyle, {borderRadius: 5}]}
    skeletonStyle={[styles.skeletonStyle]}
  />
);
export const SubTitleShimmer = () => (
  <Skeleton
    width={140}
    height={25}
    style={[styles.backStyle, {borderRadius: 5}]}
    skeletonStyle={[styles.skeletonStyle]}
  />
);

export const FlourCardShimmer = ({style}) => {
  return (
    <View
      style={[
        styles.container,
        {
          marginTop: widthResponse ? 15 : 20,
        },
      ]}>
      {[...Array(10).keys()].map((i, id) => (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 15,
          }}
          key={id}>
          <Skeleton
            width={'48%'}
            height={200}
            style={[styles.backStyle]}
            skeletonStyle={[styles.skeletonStyle]}
          />
          <Skeleton
            width={'48%'}
            height={200}
            style={[styles.backStyle]}
            skeletonStyle={[styles.skeletonStyle]}
          />
        </View>
      ))}
    </View>
  );
};

export const CommunityRecipeCardShimmer = ({style}) => {
  return (
    <View
      style={[
        styles.container,
        {
          marginTop: widthResponse ? 15 : 20,
        },
      ]}>
      {[...Array(10).keys()].map((i, id) => (
        <View style={{marginBottom: 15}} key={id}>
          <Skeleton
            width={'100%'}
            height={150}
            style={[styles.backStyle]}
            skeletonStyle={[styles.skeletonStyle]}
          />
        </View>
      ))}
    </View>
  );
};

export const HistoryCardShimmer = ({style}) => {
  return (
    <View
      style={[
        styles.container,
        {
          marginTop: widthResponse ? 15 : 20,
        },
      ]}>
      {[...Array(10).keys()].map((i, id) => (
        <View style={{marginBottom: 15}} key={id}>
          <Skeleton
            width={'100%'}
            height={90}
            style={[styles.backStyle]}
            skeletonStyle={[styles.skeletonStyle]}
          />
        </View>
      ))}
    </View>
  );
};

export const RecipeCardShimmer = ({style}) => {
  return (
    <View
      style={[
        styles.container,
        {
          marginTop: widthResponse ? 15 : 20,
        },
      ]}>
      {[...Array(10).keys()].map((i, id) => (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 15,
          }}
          key={id}>
          <Skeleton
            width={'48%'}
            height={260}
            style={[styles.backStyle]}
            skeletonStyle={[styles.skeletonStyle]}
          />
          <Skeleton
            width={'48%'}
            height={260}
            style={[styles.backStyle]}
            skeletonStyle={[styles.skeletonStyle]}
          />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: widthResponse ? 15 : 20,
  },
  backStyle: {
    borderRadius: 10,
    backgroundColor: '#f4f4f4',
  },
  skeletonStyle: {
    backgroundColor: '#e5e5e5',
  },
});
