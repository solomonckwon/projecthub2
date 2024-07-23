import React from "react";
import backgroundImage from "../styles/mountain.JPG";
import { Card, ConfigProvider, theme, Row, Col } from "antd";
import { useTheme, useThemeUpdate } from "../contexts/ThemeContext";

function About() {
    const currentTheme = useTheme();
    const toggleTheme = useThemeUpdate();
    const { defaultAlgorithm, darkAlgorithm } = theme;

    const divStyle = {
    background: `url(${backgroundImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "100vh",
    };
    

    return (
        <ConfigProvider
            theme={{
                algorithm: currentTheme === 'dark' ? darkAlgorithm : defaultAlgorithm,
            }}
        >
            <div style={divStyle}>
                <Col justify="center" align="middle" style={{ height: '100vh' }} gutter={[12, 12]}>
                    
                    <br></br>

                    <Card style={{ maxWidth: 600 }}>
                        <h2 style={{ textAlign: 'center' }}>Welcome to ProjectHub!</h2>
                        <p>
                            ProjectHub is designed to help alleviate the annoyances when dealing with projects involving multiple people. Once you have created a user, you will be taken to the dashboard, where projects can be created. This webapp was created using a MERN stack and various antd components. 
                        </p>
                    </Card>

                    <br></br>

                    <Card style={{ maxWidth: 600 }}>
                        <h1 style={{ textAlign: "center" }}>Contact</h1>

                            <p>
                                I can be found using the links below.
                                <br></br>
                                
                                <a href="https://www.linkedin.com/in/solomonkwon/">LinkedIn</a>
                                <br></br>
                                <a href="mailto:solomonckwon@gmail.com">Email</a>
                                
                            </p>
                    </Card>

                </Col>
            </div>
        </ConfigProvider>
    );
}

export default About;
