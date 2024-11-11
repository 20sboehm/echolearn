import React from 'react';
import { ScrollView, Text, Image, View } from 'react-native';
// import { Video } from 'expo-av';
import MathView from 'react-native-math-view';

const markdownPreviewer = ({ content, className }) => {
  const parseMarkdown = (text) => {
    const elements = [];
    const lines = text.split('\n'); // Split content into lines

    lines.forEach((line, index) => {
      let processedLine = line;
      let styles = [{ color: 'white' }];

      // Check for bold (**text**)
      if (processedLine.match(/\*\*(.*?)\*\*/)) {
        processedLine = processedLine.replace(/\*\*(.*?)\*\*/g, '$1');
        styles.push({ fontWeight: 'bold' });
      }

      // Check for italic (*text*)
      if (processedLine.match(/\*(.*?)\*/)) {
        processedLine = processedLine.replace(/\*(.*?)\*/g, '$1');
        styles.push({ fontStyle: 'italic' });
      }

      // Check for underline (__text__)
      if (processedLine.match(/__(.*?)__/)) {
        processedLine = processedLine.replace(/__(.*?)__/g, '$1');
        styles.push({ textDecorationLine: 'underline' });
      }

      // Headers (## or ###)
      if (processedLine.match(/^## (.*)$/)) {
        processedLine = processedLine.replace(/^## (.*)$/, '$1');
        styles.push({ fontSize: 20, fontWeight: 'bold' });
      }

      // This will work if it an actual video like .mp4
      // // Handle video: !!(videolink)
      // if (processedLine.match(/!!\((.*?)\)/)) {
      //   const [fullMatch, videoUrl] = processedLine.match(/!!\((.*?)\)/);
      //   elements.push(
      //     <Video
      //       key={index}
      //       source={{ uri: videoUrl }}
      //       style={{ width: '100%', height: 200 }}
      //       useNativeControls // Add video controls (play/pause, volume, etc.)
      //       resizeMode="contain"
      //     />
      //   );
      //   return; // Skip the rest of the logic if it's a video
      // }

      // Images (![alt](url))
      if (processedLine.match(/!\[(.*?)\]\((.*?)\)/)) {
        const [fullMatch, alt, url] = processedLine.match(/!\[(.*?)\]\((.*?)\)/);
        elements.push(
          <Image key={index} source={{ uri: url }} alt={alt} style={{ width: '100%', height: 200 }} />
        );
        return; // Skip the rest of the logic if it's an image
      }

      // Links ([text](url))
      if (processedLine.match(/\[(.*?)\]\((.*?)\)/)) {
        const [fullMatch, text, url] = processedLine.match(/\[(.*?)\]\((.*?)\)/);
        elements.push(
          <Text key={index} style={{ color: 'blue' }} onPress={() => console.log('Navigate to:', url)}>
            {text}
          </Text>
        );
        return; // Skip the rest of the logic if it's a link
      }

      // Math (Inline) - Handle $$inline$$ math
      if (processedLine.match(/\$(.*?)\$/)) {
        processedLine = processedLine.replace(/\$(.*?)\$/g, '$1');
        elements.push(
          <MathView key={index} math={processedLine} style={{ maxWidth: '100%' }} />
        );
        return; // Skip the rest of the logic if it's math
      }

      // Regular Text (after all markdown removal)
      elements.push(
        <Text key={index} style={styles.length > 0 ? styles : { fontSize: 16 }}>
          {processedLine}
        </Text>
      );
    });

    return elements;
  };

  return (
    <ScrollView className={className}>
      {parseMarkdown(content)}
    </ScrollView>
  );
};

export default markdownPreviewer;