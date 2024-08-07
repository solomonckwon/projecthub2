import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Form, Select, Tag, Button, Typography, message, Modal } from "antd";
import AuthContext from "../contexts/AuthProvider.js";

const {Text} = Typography;
const { Option } = Select;



function AddRemoveMembers() {
    const [form] = Form.useForm();
    const{ id } = useParams()
    const [project, setProject] = useState([]);
    const [visible, setVisible] = useState(false);
    const [members, setMembers] = useState([]);
    const [newMembers, setNewMembers] = useState([]);
    const [users, setUsers] = useState([]);
    const [filterValue, setFilterValue] = useState('');
    const { auth } = useContext(AuthContext);

    const handleOpen = () => {
        setVisible(true);
    };
    
    const handleClose = () => {
        setVisible(false);
        form.resetFields();
    };

    const handleSave = () => {
        let arr = members
        for(const person of newMembers)
        {
            if(isMember(person) )
            {
                arr = arr.filter(member => member._id !== person._id)
                message.error(`Removed ${person.username} from project`);
            }
            else
            {
                arr.push(person)
                message.success(`Added ${person.username} to project`);
            }
        }
        // console.log(arr)
        setVisible(false);
        form.resetFields();
        project.members = arr
        try {
            axios.patch(`http://192.168.30.147:3001/api/projects/${id}`, project);
            console.log("Project updated successfully");
            window.location.reload(false);
        }
        catch (error) {
            console.log("Error updating project:", error);
        }
        fetchProject();
        fetchUsers();
    };

    const fetchProject = async () => {
        try {
            const response = await axios.get(`http://192.168.30.147:3001/api/projects/find/${id}`);
            setProject(response.data);
        } catch (error) {
            console.log('Error fetching project:', error);
        }
    };
    const fetchUsers = async () => {
        try {
            const response = await axios.get(`http://192.168.30.147:3001/api/users/`);
            setUsers(response.data);
        } catch (error) {
            console.log('Error fetching users:', error);
        }
    };

    useEffect(() => {
        
        fetchProject();
        fetchUsers();
    }, []);

    useEffect(() => {
        setMembers(project.members);
    }, [project]);

    const isMember = (user) => {
        return members !== undefined && members.some((member) => member._id === user._id);
    };

    const handleNewMemberArray = (selectedMemberUsernames) => {
        let memArr = []
        for(const person of selectedMemberUsernames)
        {
            let newMember = users.find(user => user.username === person)
            memArr.push(newMember)
        }
        setNewMembers(memArr)
    }

    return (
        <div>
            <Button type = "primary" onClick = {handleOpen}>
            Manage Members
            </Button>

            <Modal
            open={visible}
            title="Manage Members"
            okText="Save"
            cancelText="Cancel"
            onCancel={handleClose}
            onOk={handleSave}
            >
                <Form form={form} layout="vertical" name="form_in_modal">
                    <Form.Item
                        name="users"
                        rules={[{ required: true, message: "Please select a user to friend!" }]}
                    >
                        {users !== undefined ? (
                            <Select
                                showSearch
                                mode="multiple"
                                placeholder="Find users"
                                onSearch={(value_search) => setFilterValue(value_search)}
                                onChange={(value) => handleNewMemberArray(value)}
                            >
                                {users.map((user) => (
                                    // console.log(auth.user1),
                                    <Option key={user._id} value={user.username} disabled={user.username === auth.user1}>
                                        <Tag color={isMember(user) ? (user.username === auth.user1 ? 'gold' : 'red') : 'green'}>{user.username}</Tag>
                                    </Option>
                                ))}
                            </Select>
                        ) : (
                            <Text>Loading members...</Text>
                        )}
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
    }

export default AddRemoveMembers;
