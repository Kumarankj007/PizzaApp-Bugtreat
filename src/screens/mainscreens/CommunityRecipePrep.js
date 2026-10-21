import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import appColors from '../../Utilities/appColors';
import {useStyle} from '../../Utilities/styleSheet';
import RecipeList from '../../components/Cards/RecipeList';
import {print, widthResponse} from '../../Utilities/helperFunction';
import RecipeFlour from '../../components/Cards/RecipeFlour';

const CommunityRecipePrep = ({recipe}) => {
  const appColor = appColors();
  const {commenStyle} = useStyle();
  return (
    <View
      style={[
        commenStyle.container,
        {
          paddingVertical: widthResponse ? 10 : 15,
        },
      ]}>
      {/* list one */}
      {/* {recipe?.flour && (
        <RecipeList
          flour
          top
          bottom
          label={`${recipe?.flour?.heading}  -  ${recipe?.flour?.flourDetails}`}
          title={recipe?.flour?.title}
          value={recipe?.flour?.value}
          unit={recipe?.flour?.postfix}
        />
      )} */}

      {/* list two */}
      {recipe?.restTimes && (
        <>
          {/* <RecipeList
            top
            border
            margin
            label={recipe?.restTimes.title}
            title={recipe?.restTimes.withcool?.title}
            value={recipe?.restTimes.withcool?.value}
          />
          <RecipeList
            bottom
            title={recipe?.restTimes.withoutcool?.title}
            value={recipe?.restTimes.withoutcool?.value}
          /> */}
          {/* resting note */}
          {/* {recipe?.restTimes.restNote && (
            <Text
              style={[
                commenStyle.para,
                {
                  color: appColor.primary,
                },
              ]}>
              {recipe.restTimes.restNote}
            </Text>
          )} */}
        </>
      )}

      {/* recipe list three */}
      {recipe?.doughBalls && (
        <>
          <RecipeList
            top
            border
            margin
            label={recipe?.doughBalls?.title}
            title={recipe?.doughBalls?.pieces?.title}
            value={recipe?.doughBalls?.pieces?.value}
            unit={recipe?.doughBalls?.pieces?.postfix}
          />
          <RecipeList
            bottom
            title={recipe?.doughBalls?.weight?.title}
            value={recipe?.doughBalls?.weight?.value}
            unit={recipe?.doughBalls?.weight?.postfix}
          />
        </>
      )}

      {/* used flour  */}
      {recipe?.flour?.flourDetails && (
        <RecipeFlour
          title={recipe?.flour?.heading}
          flourName={recipe?.flour?.flourDetails}
          flourimage={recipe?.flour?.flourImg}
        />
      )}
      {/* recipe list four */}
      {recipe?.yourValues && (
        <>
          <RecipeList
            flour
            top
            border
            margin
            label={recipe?.yourValues?.title}
            title={recipe?.flour?.title}
            value={recipe?.flour?.value}
            unit={recipe?.flour?.postfix}
          />
          <RecipeList
            border
            margin
            title={recipe?.yourValues?.hydration?.title}
            value={recipe?.yourValues?.hydration?.value}
            // unit={recipe?.yourValues?.hydration?.postfix}
            unit={`${recipe?.yourValues?.hydration?.postfix} (${recipe?.yourValues?.hydration?.value_percent}%)`}
          />

          <RecipeList
            margin
            border
            title={recipe?.yourValues?.yeastType?.title}
            value={recipe?.yourValues?.yeastType?.value}
          />
          <RecipeList
            margin
            border
            title={recipe?.yourValues?.yeast?.title}
            value={recipe?.yourValues?.yeast?.value}
            unit={recipe?.yourValues?.yeast?.postfix}
          />
          <RecipeList
            margin
            border
            title={recipe?.yourValues?.salt?.title}
            value={recipe?.yourValues?.salt?.value}
            unit={recipe?.yourValues?.salt?.postfix}
          />

          <RecipeList
            bottom
            title={recipe?.yourValues?.oil?.title}
            value={recipe?.yourValues?.oil?.value}
            unit={recipe?.yourValues?.oil?.postfix}
          />
        </>
      )}

      {/* pre dough and main-dough */}

      {recipe?.preDoughValues && (
        <>
          <RecipeList
            margin
            top
            border
            label={recipe?.preDoughValues?.title}
            title={recipe?.preDoughValues?.pre_dough_types?.title}
            value={recipe?.preDoughValues?.pre_dough_types?.value}
          />
          <RecipeList
            border
            margin
            flour
            title={recipe?.preDoughValues?.flour?.title}
            value={recipe?.preDoughValues?.flour?.value}
            unit={recipe?.preDoughValues?.flour?.postfix}
          />

          <RecipeList
            margin
            border
            unit={recipe?.preDoughValues?.hydration?.postfix}
            title={recipe?.preDoughValues?.hydration?.title}
            value={recipe?.preDoughValues?.hydration?.value}
          />
          <RecipeList
            margin
            border
            title={recipe?.preDoughValues?.yeast?.title}
            value={recipe?.preDoughValues?.yeast?.value}
            unit={recipe?.preDoughValues?.yeast?.postfix}
          />
          <RecipeList
            bottom
            title={recipe?.preDoughValues?.total_voordeeg?.title}
            value={Number(
              recipe?.preDoughValues?.total_voordeeg?.value,
            ).toFixed(2)}
          />
        </>
      )}

      {recipe?.mainDoughValues && (
        <>
          <RecipeList
            flour
            top
            border
            margin
            label={recipe?.mainDoughValues?.title}
            title={recipe?.mainDoughValues?.flour?.title}
            value={recipe?.mainDoughValues?.flour?.value}
            unit={recipe?.mainDoughValues?.flour?.postfix}
          />

          <RecipeList
            margin
            border
            unit={recipe?.mainDoughValues?.hydration?.postfix}
            title={recipe?.mainDoughValues?.hydration?.title}
            value={recipe?.mainDoughValues?.hydration?.value}
          />
          {/* <RecipeList
                      margin
                      border
                      title={recipe?.mainDoughValues?.yeast?.title}
                      value={recipe?.mainDoughValues?.yeast?.value}
                      unit={recipe?.mainDoughValues?.yeast?.postfix}
                    /> */}
          <RecipeList
            margin
            border
            title={recipe?.mainDoughValues?.salt?.title}
            value={recipe?.mainDoughValues?.salt?.value}
            unit={recipe?.mainDoughValues?.salt?.postfix}
          />

          <RecipeList
            bottom
            title={recipe?.mainDoughValues?.oil?.title}
            value={recipe?.mainDoughValues?.oil?.value}
            unit={recipe?.mainDoughValues?.oil?.postfix}
          />
        </>
      )}

      {/* total dough  */}
      {recipe?.yourValues?.total_deeg?.value != 0 && (
        <RecipeList
          top
          bottom
          flour
          label={recipe?.yourValues?.total_deeg?.title}
          title={recipe?.flour?.title}
          value={recipe?.yourValues?.total_deeg?.value}
          unit={recipe?.yourValues?.total_deeg?.postfix}
        />
      )}
    </View>
  );
};

export default CommunityRecipePrep;

const styles = StyleSheet.create({});
