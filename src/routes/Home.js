
import { Card } from 'antd';
import backgroundImage from "../styles/mountain.JPG";
import { useTheme, useThemeUpdate } from "../contexts/ThemeContext";
import { ConfigProvider, theme, Typography, Layout } from 'antd';
import React, { useState, useEffect } from 'react';

const { Footer } = Layout;
const { Text , Link } = Typography;

const TypingAnimation = () => {
  const [text, setText] = useState('');
  const fullText = "Weelcome to ProjectHub!";

  useEffect(() => {
    let isMounted = true;
    let currentIndex = 0;

    const typeText = () => {
      if (currentIndex < fullText.length - 1) {
        if (isMounted) {
          setText((text) => text + fullText.charAt(currentIndex));
          currentIndex++;
          setTimeout(typeText, 100); // Adjust typing speed here (in milliseconds)
        } else {
          currentIndex = fullText.length; // Stop the animation if component is unmounted
        }
      }
    };
    typeText();

    return () => {
      isMounted = false;
    };
  }, []);

  return <Text strong>{text}</Text>;
};


const { defaultAlgorithm, darkAlgorithm } = theme;

const Home = (props) => {
  const currentTheme = useTheme();
  const toggleTheme = useThemeUpdate();
  const divStyle = {
    background: `url(${backgroundImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "100vh",
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: currentTheme === "dark" ? darkAlgorithm : defaultAlgorithm,
      }}>

      <div className="home" style={divStyle}>
        <center>
          <h1>
            Project
            <span>Hub</span>
          </h1>
          <p>Leaf your project collaboration frustrations behind!</p>
          <TypingAnimation />
        </center>
      </div>

      <Footer style={{ textAlign: 'center' }}>
      I took this background image at Black Mountain, CA. One of my favorite places to climb!
    </Footer>
    </ConfigProvider>
  );
}

export default Home;
