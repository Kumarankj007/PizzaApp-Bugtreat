import {View, Text} from 'react-native';
import React, {useEffect} from 'react';
import IframeRenderer, {iframeModel} from '@native-html/iframe-plugin';
import TableRenderer, {tableModel} from '@native-html/table-plugin';
import WebView from 'react-native-webview';
import RenderHTML, {
  HTMLContentModel,
  HTMLElementModel,
} from 'react-native-render-html';
// import Videos from 'react-native-video';
import appColors from '../../Utilities/appColors';
import { appFont } from '../../Utilities/appFont';
import { scrnWidth } from '../../Utilities/helperFunction';

export default function HtmlView({url, uri, padding = 30, width}) {
  const appColor = appColors();

  const customHTMLElementModels = {
    html: HTMLElementModel.fromCustomModel({
      tagName: 'html',
      contentModel: HTMLContentModel.mixed,
    }),
    link: HTMLElementModel.fromCustomModel({
      tagName: 'link',
      contentModel: HTMLContentModel.mixed,
    }),
    font: HTMLElementModel.fromCustomModel({
      tagName: 'font',
      contentModel: HTMLContentModel.mixed,
    }),
    embed: HTMLElementModel.fromCustomModel({
      tagName: 'embed',
      contentModel: HTMLContentModel.mixed,
    }),
    ul: HTMLElementModel.fromCustomModel({
      tagName: 'ul',
      contentModel: HTMLContentModel.mixed,
    }),
    iframe: iframeModel,
    table: tableModel,
    webViewProps: {
      allowsFullScreen: true,
      androidLayerType: 'software',
      allowsFullscreenVideo: true,
      scalesPageToFit: true,
      textSelectable: true,
    },
    // video: HTMLElementModel.fromCustomModel({
    //   tagName: 'video',
    //   contentModel: HTMLContentModel.block,
    //   isVoid: false,
    // }),
  };

  const renderers = {
    iframe: IframeRenderer,
    table: TableRenderer,
    // video: ({TDefaultRenderer, ...props}) => {
    //   return <Videos source={{uri: props.tnode.init.domNode.attribs.src}} />;
    // },
  };

  const htmlContent = `<html>
                          <head>
                            <style>
                              @font-face {
                                font-family: 'MyCustomFont';
                                src: url('https://app.smart-golf.eu/assets/fonts/Roboto-medium.ttf') format('truetype');
                              }
                              body {
                                font-family: 'MyCustomFont', sans-serif;
                                color:red;
                                font-size:50px;
                              }
                            </style>
                          </head>
                          <body>
                            ${url}
                          </body>
                        </html>`;

  return (
    <View>
      <RenderHTML
        renderers={renderers}
        // defaultTextProps={{selectable: true}}
        source={{html: htmlContent, uri: uri}}
        contentWidth={scrnWidth}
        tagsStyles={{
          body: {
            whiteSpace: 'normal',
            color: appColor.textBlack,
            font: appFont.lR,
            // lineHeight: fontScalling(2.2),
            width: width ? width : scrnWidth - padding,
          },
          p: {
            width: '100%',
            alignSelf: 'center',
          },
          iframe: {
            alignSelf: 'center',
            opacity: 0.99,
          },
          // video: {
          //   width: '100%',
          //   alignSelf: 'center',
          //   height: scrnWidth / 1.8,
          // },
          table: {
            alignSelf: 'center',
            width: '100%',
          },
        }}
        renderersProps={{
          iframe: {
            scalesPageToFit: true,
            webViewProps: {
              allowsFullScreen: true,
              androidLayerType: 'software',
              textSelectable: true,
            },
          },
        }}
        customHTMLElementModels={customHTMLElementModels}
        WebView={WebView}
      />
    </View>
  );
}
