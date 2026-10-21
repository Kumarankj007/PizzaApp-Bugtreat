import {useSelector} from 'react-redux';
import searchEN from '../../assets/videos/Search_flour_EN.mp4';
import searchNL from '../../assets/videos/Search_flour_NL.mp4';

export const useAppVideos = () => {
  const setters = useSelector(state => state.appSettings.setters);
  const search = {
    english: require('../../assets/videos/Search_flour_EN.mp4'),
    dutch: require('../../assets/videos/Search_flour_NL.mp4'),
  };

  const setPlan = {
    english: require('../../assets/videos/Pizzaplan_EN.mp4'),
    dutch: require('../../assets/videos/Pizzaplan_NL.mp4'),
  };
  const calculator = {
    english: require('../../assets/videos/Calculator_EN.mp4'),
    dutch: require('../../assets/videos/Calculator_NL.mp4'),
  };
  const recipes = {
    english: require('../../assets/videos/Recipes_EN.mp4'),
    dutch: require('../../assets/videos/Recipes_NL.mp4'),
  };
  const community = {
    english: require('../../assets/videos/Community_EN.mp4'),
    dutch: require('../../assets/videos/Community_NL.mp4'),
  };
  const wizard = {
    english: require('../../assets/videos/PizzaPlanner_EN.mp4'),
    dutch: require('../../assets/videos/PizzaPlanner_NL.mp4'),
  };

  const lang = setters
    ? setters?.language?.language_code == 'nl'
      ? true
      : false
    : false;

  return {
    searchVideo: lang ? search.dutch : search.english,
    setPlanVideo: lang ? setPlan.dutch : setPlan.english,
    calculatorVideo: lang ? calculator.dutch : calculator.english,
    recipesVideo: lang ? recipes.dutch : recipes.english,
    communityVideo: lang ? community.dutch : community.english,
    wizardVideo: lang ? wizard.dutch : wizard.english,
  };
};
