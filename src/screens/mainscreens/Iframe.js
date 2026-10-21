import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import HtmlView from '../../components/HtmlElement/RenderHtml'
import WebView from 'react-native-webview';

const Iframe = ({
    link
}) => {

    return <>{link != '' && <WebView source={{uri: link}} style={{flex: 1}} />}</>;
}

export default Iframe

const styles = StyleSheet.create({})