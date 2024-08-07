import useFetch from '../hooks/useFetch';
import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../contexts/AuthProvider.js";
import { showErrorDialog } from '../components/ErrorDialog';
import axios from 'axios';
import moment from 'moment';
import ProjectForm from '../components/ProjectCreation';

// AntD
import { Table, Button, Menu, Dropdown, Modal, Form, Input, ConfigProvider, theme, Card, Row, Col } from 'antd';
import { Link } from 'react-router-dom';
import EditProjectDialogFromDashboard from '../components/EditProjectDialogFromDashboard';
import { useTheme, useThemeUpdate } from "../contexts/ThemeContext";

function Dashboard() {
    const { defaultAlgorithm, darkAlgorithm } = theme;
    const currentTheme = useTheme();

    const { data, loading, error } = useFetch('http://192.168.30.147:3001/api/projects');
    const [projects, setProjects] = useState([]);
    const [deleteProject, setDeleteProject] = useState({});
    const [user, setUser] = useState([]);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);

    const { auth } = useContext(AuthContext);

    //set token to newly logged in user
    useEffect(() => {
        if (auth) {
            //console.log(auth);
            localStorage.setItem("token", JSON.stringify(auth));
        }
        fetchUser();
    }, [auth]);

    useEffect(() => {
        if (user._id) {
            fetchProjects();
        }
    }, [user]);

    const handleDelete = async (id) => {
        setDeleteModalVisible(true);
        setDeleteProject(id)
        console.log(id)
    }

    const confirmDelete = async () => {
        // Logic to delete the project with the given id
        setDeleteModalVisible(false);
        try {
            await axios.delete(`http://192.168.30.147:3001/api/projects/delete/${deleteProject}`);
            window.location.href = '/dashboard';
        } catch (error) {
            console.log('Error deleting project:', error);
            showErrorDialog('Error deleting project');
        }
        setDeleteModalVisible(false);
    };

    const cancelDelete = () => {
        setDeleteModalVisible(false);
    };

    //get currently logged in user
    const fetchUser = async () => {
        try {
            const response = await axios.get(`http://192.168.30.147:3001/api/users/findusername/${auth.user1}`)
            setUser(response.data);
            // console.log(response.data)
            fetchProjects();
        } catch (error) {
            console.error(error);
        }
    };

    //get projects owned or a member of by logged in user
    const fetchProjects = async () => {
        try {
            await new Promise((resolve) => setTimeout(resolve, 0));
            //owners are members as well
            if (user._id !== undefined) {
                const response_member = await axios.get(`http://192.168.30.147:3001/api/projects/findbymember/${user._id}`)
                const response_owner = await axios.get(`http://192.168.30.147:3001/api/projects/findbyowner/${user._id}`)
                const concatenatedResponse = ([...response_member.data, ...response_owner.data])
                const uniqueResponse = Array.from(
                    new Set(
                        concatenatedResponse.map(item => item._id)
                    )
                ).map(id => concatenatedResponse.find(item => item._id === id));
                setProjects([...uniqueResponse]);
            }
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        fetchProjects();
    }, []);

    const [editModalVisible, setEditModalVisible] = useState(false);
    const [addTaskModalVisible, setAddTaskModalVisible] = useState(false);

    const handleEdit = (record) => {
        setEditModalVisible(true);
    };

    const handleAddTask = (record) => {
        setAddTaskModalVisible(true);
    };

    const handleEditModalCancel = () => {
        setEditModalVisible(false);
    };

    const handleAddTaskModalCancel = () => {
        setAddTaskModalVisible(false);
    };

    const handleEditModalSubmit = (values) => {
        console.log('Edit Form Values:', values);
        setEditModalVisible(false);
    };

    const handleAddTaskModalSubmit = (values) => {
        console.log('Add Task Form Values:', values);
        setAddTaskModalVisible(false);
    };

    const editMenu = (project_details, record) => (
        <Menu>
            <Menu.Item>
                <EditProjectDialogFromDashboard project={project_details} />
            </Menu.Item>
            <Menu.Item key="addTask">
                <Button
                    danger
                    type="primary"
                    onClick={() => handleDelete(record._id)}
                    style={{ backgroundColor: 'red', borderColor: 'red' }}
                >
                    Delete
                </Button>
            </Menu.Item>
        </Menu>
    );


    const columns = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            render: (text, record) => (
                <Link to={`/Projects/${record._id}`}>{text}</Link>
            ),
            sorter: (a, b) => a.title.localeCompare(b.title),
        },
        {
            title: 'Owner',
            dataIndex: 'owner',
            key: 'owner',
            render: (owner) => <div>{owner.username}</div>,
            sorter: (a, b) => a.owner.username.localeCompare(b.owner.username),
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            sorter: (a, b) => a.description.localeCompare(b.description),
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
            render: (createdAt) => <div>{moment(createdAt).format('MM/DD/YYYY')}</div>,
        },
        {
            title: 'Deadline',
            dataIndex: 'deadline',
            key: 'deadline',
            sorter: (a, b) => new Date(a.deadline) - new Date(b.deadline),
            render: (deadline) => <div>{moment(deadline).format('MM/DD/YYYY')}</div>,
        },
        {
            title: 'Actions',
            key: 'actions',
            dataIndex: '_id',
            render: (text, record) => (
                <div>
                    <div>
                        <Dropdown overlay={editMenu(text, record)}>
                            <Button>Actions</Button>
                        </Dropdown>
                    </div>
                </div>
            ),
        },
    ];

    function CreateProjectModal({ onSubmit, onClose }) {
        const [modalVisible, setModalVisible] = useState(false);
      
        const showModal = () => {
          setModalVisible(true);
        };
      
        const handleModalOk = async () => {
          await onSubmit();
          setModalVisible(false);
        };
      
        const handleModalCancel = () => {
          setModalVisible(false);
          onClose();
        };
      
        return (
          <>
            <Button type="primary" onClick={showModal}>
              Create Project
            </Button>
      
            <Modal
              title="Create Project"
              visible={modalVisible}
              onOk={handleModalOk}
              onCancel={handleModalCancel}
              footer={null}
            >
              <ProjectForm />
            </Modal>
          </>
        );
      }
      
      function CreateProject() {
        const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false);
        const [form] = Form.useForm(); // Add this line to use Ant Design's Form component
      
        const handleProjectSubmit = async () => {
          await fetchProjects();
          setIsCreateProjectModalOpen(false); // Close the form after submitting
          form.resetFields(); // Reset form fields
        };
      
        const openCreateProjectModal = () => {
          setIsCreateProjectModalOpen(true);
        };
      
        useEffect(() => {
          if (isCreateProjectModalOpen) {
            fetchProjects(); // Call fetchProjects when the modal is open
          }
        }, [isCreateProjectModalOpen]);
      
        return (
          <>
            <CreateProjectModal
              onSubmit={handleProjectSubmit}
              onClose={() => {
                setIsCreateProjectModalOpen(false);
                form.resetFields(); // Reset form fields when closing the modal
              }}
            />
          </>
        );
      }
      
    // Return --------------------------------------------------
    const cardStyle = {
        display: 'flex',
        alignItems: 'top',
        justifyContent: 'top',
        height: '100vh',
    };

    return (
        <ConfigProvider
            theme={{
                algorithm: currentTheme === 'dark' ? darkAlgorithm : defaultAlgorithm,
            }}>
            <Card style={cardStyle}>
                <Row gutter={16}>
                    <Col span={12} style={{ textAlign: 'left' }}>
                        <h1>My Dashboard</h1>
                        {loading && <div>Loading...</div>}
                        {error && showErrorDialog(error)}
                    </Col>
                    <Col span={12} style={{ textAlign: 'right' }}>
                        <CreateProject />
                    </Col>
                </Row>
                <div><br /></div>
                <Card>
                    <Table
                        dataSource={projects}
                        columns={columns}
                        pagination={{ pageSize: 8, position: ['bottomCenter'] }}
                        scroll={{ y: '100%' }}
                        loading={loading}
                        locale={{
                            emptyText: 'No data available',
                        }}
                    />
                </Card>
                <Modal
                    visible={deleteModalVisible}
                    title="Confirm Delete"
                    okText="Delete"
                    cancelText="Cancel"
                    onOk={confirmDelete}
                    onCancel={cancelDelete}
                >
                    Are you sure you want to delete the project?
                </Modal>
                <Modal
                    open={editModalVisible}
                    onCancel={handleEditModalCancel}
                    onOk={handleEditModalSubmit}
                    title="Edit Form"
                >
                    <Form>
                        <Form.Item label="Title" name="editTitle">
                            <Input />
                        </Form.Item>
                    </Form>
                </Modal>

            </Card>
        </ConfigProvider >
    );
};



export default Dashboard;