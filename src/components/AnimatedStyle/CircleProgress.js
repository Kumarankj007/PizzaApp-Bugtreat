import React, {useEffect} from 'react';
import Svg, {Circle} from 'react-native-svg';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { scrnWidth } from '../../Utilities/helperFunction';
import appColors from '../../Utilities/appColors';



const CircleProgress = ({childeren, load}) => {
  const Radius = scrnWidth / 8 - 3;
  const circleLength = Radius * 2 * Math.PI;
  const progress = useSharedValue(0);
  const appColor = appColors()
  const AnimateCircle = Animated.createAnimatedComponent(Circle);

  useEffect(() => {
    progress.value = 0;
    progress.value = withTiming(progress.value > 0 ? (!load ? 0 : 1) : 1, {
      duration: load ? 700 : 1200,
    });
  }, [load]);

  const animatedProps = useAnimatedProps(() => {
    // const offset = interpolate(progress.value, [0, 1], [circleLength, 0]);
    const offset = circleLength * (1 - progress.value);
    return {
      strokeDashoffset: offset,
    };
  });
  return (
    <Svg fill={'transparent'} style={{position: 'absolute', zIndex: 20}}>
      <Circle
        cx={scrnWidth / 8}
        cy={scrnWidth / 8}
        r={Radius}
        stroke={'transparent'}
        strokeWidth={5}
      />

      {load && (
        <AnimateCircle
          cx={scrnWidth / 8}
          cy={scrnWidth / 8}
          r={Radius}
          stroke={appColor.white}
          strokeWidth={5}
          strokeDasharray={circleLength}
          animatedProps={animatedProps}
          strokeLinecap="round"
        />
      )}
    </Svg>
  );
};

export default CircleProgress;
