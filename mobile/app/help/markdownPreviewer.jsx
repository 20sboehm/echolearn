import React from 'react';
import { ScrollView, Text, Image, View, Linking } from 'react-native';
// import { Video } from 'expo-av';
import MathView from 'react-native-math-view';

const markdownPreviewer = ({ content, className }) => {
  const parseMarkdown = (text) => {
    const elements = [];
    const lines = text.split('\n'); // Split content into lines

    lines.forEach((line, index) => {
      let processedLine = line;
      let textSegments = [];
      let lastIndex = 0;

      // Regex pattern for detecting nested markdown styles
      const markdownPattern = /(\*\*\_\_\*(.*?)\*\_\_\*\*|\*\*\*(.*?)\*\*\*|\*\*(.*?)\*\*|\_\_(.*?)\_\_|\*(.*?)\*)/g;
      let match;

      // Helper function to push regular text
      const pushText = (text, styles) => {
        if (text) {
          textSegments.push(<Text key={`${index}-${lastIndex}`} style={styles}>{text}</Text>);
        }
      };

      // Process inline markdown matches
      while ((match = markdownPattern.exec(processedLine)) !== null) {
        // Push text before the matched markdown
        pushText(processedLine.substring(lastIndex, match.index), { color: 'white' });

        // Determine styles based on the matched markdown
        let styles = [{ color: 'white' }];
        let matchedText = match[0]; // Get the full matched text

        // Apply styles based on detected markers
        if (matchedText.includes('**')) {
          styles.push({ fontWeight: 'bold' });
          matchedText = matchedText.replace(/\*\*/g, ''); // Remove all instances of '**'
        }

        if (matchedText.includes('__')) {
          styles.push({ textDecorationLine: 'underline' });
          matchedText = matchedText.replace(/__/g, ''); // Remove all instances of '__'
        }

        if (matchedText.includes('*') && !matchedText.includes('**')) {
          styles.push({ fontStyle: 'italic' });
          matchedText = matchedText.replace(/\*/g, ''); // Remove all instances of '*'
        }

        // Add the styled text segment
        textSegments.push(
          <Text key={`markdown-${index}-${match.index}`} style={styles}>
            {matchedText}
          </Text>
        );

        lastIndex = markdownPattern.lastIndex;
      }

      // Handle images (![alt](url))
      const imagePattern = /!\[(.*?)\]\((.*?)\)/g;
      processedLine = processedLine.replace(imagePattern, (fullMatch, alt, url) => {
        elements.push(
          <Image key={`${index}`} source={{ uri: url }} alt={alt} style={{ width: '100%', height: 200 }} />
        );
        return ''; // Remove the image markdown from the processed line
      });

      // Handle links ([text](url))
      const linkPattern = /\[(.*?)\]\((.*?)\)/g;
      processedLine = processedLine.replace(linkPattern, (fullMatch, text, url) => {
        elements.push(
          <Text
            key={`${index}`}
            style={{ color: 'blue' }}
            onPress={() => Linking.openURL(url)}
          >
            {text}
          </Text>
        );
        return ''; // Remove the link markdown from the processed line
      });

      // Handle inline math ($inline math$)
      const mathPattern = /\$\$(.*?)\$\$/g;
      processedLine = processedLine.replace(mathPattern, (fullMatch, mathContent) => {
        elements.push(
          <MathView key={`${index}`} math={mathContent} style={{ color: 'white', maxWidth: '100%' }} />
        );
        return ''; // Remove the math markdown from the processed line
      });

      // Push any remaining text after the last markdown match
      pushText(processedLine.substring(lastIndex), { color: 'white' });

      // Add the processed line segments to the elements array
      elements.push(<Text key={index} style={{ color: 'white' }}>{textSegments}</Text>);
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