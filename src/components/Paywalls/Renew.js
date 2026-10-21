import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ModalBottomSheet from '../BottomSheet/ModalBottomSheet'
import { RenewContent } from '../../Utilities/contents'
import appColors from '../../Utilities/appColors'
import { useStyle } from '../../Utilities/styleSheet'
import { appFont } from '../../Utilities/appFont'
import { fontScalling } from '../../Utilities/helperFunction'
import TickList from '../Cards/TickList'
import PrimaryButton from '../Buttons/PrimaryButton'

const Renew = ({
    visible
}) => {

    const appColor = appColors()
    const { commenStyle } = useStyle()


    const [renewContent,setRenewContent] = useState({})
    useEffect(() => {
        setRenewContent(RenewContent)
    },[])
  return (
    <>
        <ModalBottomSheet
            snapPoints={['50%', '50%']}
            isVisible={visible}
            sheetTitle={renewContent?.sheetTitle}
        >
            {/* date detail */}
            <View
                style={{
                    borderRadius:10,
                    overflow:'hidden',
                    backgroundColor:appColor.cardbg,
                    marginBottom:20
                }}
            >
                {renewContent?.expiry?.date && 
                    <Text
                        style={[{
                            fontFamily: appFont.lBl,
                            color: appColor.black,
                            fontSize: fontScalling(3),
                            textAlign:'center',
                            padding:10
                        }]}
                    >
                        {renewContent?.expiry?.date }
                    </Text>
                }
                {renewContent?.expiry?.description && 
                    <Text
                        style={[{
                            fontFamily: appFont.lB,
                            color: appColor.black,
                            fontSize: fontScalling(2),
                            textAlign:'center',
                            padding:10,
                            backgroundColor:appColor.borderColor
                        }]}
                    >
                        {renewContent?.expiry?.description }
                    </Text>
                }
                
            </View>

            {/* content  */}
            {renewContent?.para1 && 
                <Text
                    style={[commenStyle.para]}
                >
                    {renewContent?.para1}
                </Text>
            }
            {/* ticks */}
            {
                renewContent?.list && renewContent?.list.length > 0 &&
                <TickList
                    list={renewContent?.list}
                />
            }
            {/* button */}
            {renewContent?.button && 
                <PrimaryButton
                    text={renewContent?.button}
                    style={{
                        marginTop:20
                    }}
                />
            }
        </ModalBottomSheet>
    </>
  )
}

export default Renew

const styles = StyleSheet.create({})