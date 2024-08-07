import React, { useState, useEffect, useContext } from 'react';
import { Form, Input, Button, DatePicker, Select, Card } from 'antd';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { AlignCenterOutlined } from '@ant-design/icons';
import AuthContext from "../contexts/AuthProvider.js";
import moment from 'moment';

const { Option } = Select;

const ProjectForm = () => {
  const { auth } = useContext(AuthContext);
  const [members, setMembers] = useState([]);
  const [tasks, addTask] = useState([]);
  const navigate = useNavigate();

  const onFinish = async values => {
    console.log('Success:', values);

    const userIDs = []
    //find the IDs associated with passed usernames
    for (const username of values.members) {
      try{
        const user_id = await axios.get(`http://192.168.30.147:3001/api/users/findusername/${username}`);
        userIDs.push(user_id.data._id);
      } catch (error) {
        console.log("Issue with finding user_id (CreateProject.js)")
      }
    }
    values.members = userIDs;

    try {
      const userlogged = await axios.get(`http://192.168.30.147:3001/api/users/findusername/${auth.user1}`);
      values.members.push(userlogged.data._id);
      const data = { ...values, owner: userlogged.data._id }; // Add the owner field with the logged-in user's _id
      console.log(data)

      //Check for valid deadline
      const curr_date = new Date();
      if (data.deadline < curr_date) {
        //TODO: add a popup here
        console.log('Invalid deadline');
        return;
      }

      await axios.post('http://192.168.30.147:3001/api/projects/add', data);
      console.log('Project created successfully');
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
    }
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };
  const fetchMembers = async () => {
    try {
      const response = await axios.get(`http://192.168.30.147:3001/api/users/`);
      setMembers(response.data);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchMembers(); // Call fetchMembers when the component is mounted
  }, []); // The empty dependency array [] ensures that the effect runs only once on component mount



  return (
    <Card title="Create a Project">
      <Form
        name="basic"
        labelCol={AlignCenterOutlined}
        wrapperCol={{ span: 16 }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="Project Name"
          name="title"
          rules={[{ required: true, message: 'Please input your project name!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: 'Please input your project description!' }]}
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          label="Members"
          name="members"
          rules={[{ required: true, message: 'Please select project members!' }]}
        >
          <Select
            mode="multiple"
            showSearch
            // onSearch={fetchMembers}
            filterOption={true}
            placeholder="Select members"
          >
            {members.map(member => (
              <Option key={member._id} value={member.username}>
                {member.username}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Deadline"
          name="deadline"
          rules={[{ required: true, message: 'Please select a deadline!' }]}
        >
          <DatePicker disabledDate={(current) => current.isBefore(moment() - 1)} />
        </Form.Item>
        <Form.Item
          name={['task']}
        >
          {/* <TaskForm tasks={tasks} addTask={addTask} /> */}
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default ProjectForm;
