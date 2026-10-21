import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useState} from 'react';
import appColors from '../../Utilities/appColors';
import {useStyle} from '../../Utilities/styleSheet';
import {
  fontScalling,
  print,
  scrnWidth,
  widthResponse,
} from '../../Utilities/helperFunction';
import SwitchingTab from '../../components/Buttons/SwitchingTab';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import HistoryCard from '../../components/Cards/HistoryCard';
import {appFont} from '../../Utilities/appFont';
import WizardProcess from '../../components/Cards/WizardProcess';
import * as Animatable from 'react-native-animatable';
import StepIndicator from 'react-native-step-indicator';
import SortingTab from '../../components/Buttons/SortingTab';
import WizardHistory from './WizardHistory';
import WizardQue from './WizardQue';

const WizardStep3 = ({content}) => {
  const appColor = appColors();
  const {commenStyle} = useStyle();
  const [sort, setSort] = useState(1);

  return (
    <View
      style={{
        backgroundColor: appColor.cardBack,
        flex: 1,
      }}>
      <View
        style={{
          paddingTop: widthResponse ? 15 : 20,
          paddingHorizontal: widthResponse ? 15 : 20,
        }}>
        {content?.step3?.title && (
          <Text
            style={[
              commenStyle.sideHead,
              {
                textAlign: 'center',
              },
            ]}>
            {content?.step3?.title}
          </Text>
        )}

        <SwitchingTab
          button1={content?.step3?.sorting?.buttonOne}
          button2={content?.step3?.sorting?.buttonTwo}
          activeButton={num => {
            setSort(num);
          }}
          value={sort}
          style={{
            marginBottom: 15,
          }}
        />
      </View>

      {/* recipe plan */}
      {sort == 1 && <WizardQue content={content} />}
      {/* history */}
      {sort == 2 && <WizardHistory content={content} />}
    </View>
  );
};

export default WizardStep3;

const styles = StyleSheet.create({});
