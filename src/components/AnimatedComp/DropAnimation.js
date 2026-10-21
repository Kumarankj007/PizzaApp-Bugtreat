import { LayoutAnimation } from "react-native"

export const DropAnimation = {
    duration : 300,
    update : {
        duration : 300 ,
        property : LayoutAnimation.Properties.opacity,
        type : LayoutAnimation.Types.easeIn
    },
    delete : {
        duration : 300 ,
        property : LayoutAnimation.Properties.opacity,
        type : LayoutAnimation.Types.easeOut
    }
}