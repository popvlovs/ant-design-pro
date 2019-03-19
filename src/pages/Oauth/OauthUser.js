import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Menu,
  Modal,
  message,
  Badge,
  Switch,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Moment from 'moment';
import crypto from 'crypto';
import styles from './OauthUser.less';

const FormItem = Form.Item;

/**
 * 新增用户表单
 */
@Form.create()
class CreateForm extends PureComponent {
  constructor(props) {
    super(props);

    this.formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
  }

  state = {};

  okHandle = () => {
    const { form, handleAdd, handleAddModalVisible } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
      handleAddModalVisible();
    });
  };

  handleConfirmBlur = e => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  validateToNextPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  };

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback('两次输入的密码不一致!');
    } else {
      callback();
    }
  };

  render() {
    const { modalVisible, form, handleAdd, handleAddModalVisible } = this.props;
    return (
      <Modal
        destroyOnClose
        title="创建用户"
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleAddModalVisible()}
      >
        <Form {...this.formItemLayout}>
          <FormItem label="用户名（邮箱）">
            {form.getFieldDecorator('username', {
              rules: [
                {
                  required: true,
                  message: '请输入合法的用户邮箱！',
                  pattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/i,
                },
              ],
            })(
              <Input
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="请输入用户名"
              />
            )}
          </FormItem>
          <FormItem label="密码">
            {form.getFieldDecorator('password', {
              rules: [
                {
                  required: true,
                  message: '请输入密码！至少8位，需同时包括字母和数字',
                  pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/i,
                },
                {
                  validator: this.validateToNextPassword,
                },
              ],
            })(
              <Input
                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                type="password"
                placeholder="请输入密码"
              />
            )}
          </FormItem>
          <Form.Item label="确认密码">
            {form.getFieldDecorator('confirm', {
              rules: [
                {
                  required: true,
                  message: '请输入密码！',
                },
                {
                  validator: this.compareToFirstPassword,
                },
              ],
            })(
              <Input
                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                type="password"
                placeholder="请输入密码"
                onBlur={this.handleConfirmBlur}
              />
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

/**
 * 编辑用户表单
 */
@Form.create()
class UpdateForm extends PureComponent {
  constructor(props) {
    super(props);

    this.formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
  }

  state = {};

  okHandle = () => {
    const form = this.props.form;
    const { values, handleUpdate, handleUpdateModalVisible } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      const updateValues = { ...values, ...fieldsValue };
      handleUpdate(updateValues);
      handleUpdateModalVisible();
    });
  };

  handleConfirmBlur = e => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  };

  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('两次输入的密码不一致!');
    } else {
      callback();
    }
  };

  render() {
    const { values, modalVisible, form, handleUpdate, handleUpdateModalVisible } = this.props;
    return (
      <Modal
        destroyOnClose
        title="编辑用户"
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleUpdateModalVisible()}
      >
        <Form {...this.formItemLayout}>
          <FormItem label="用户名（邮箱）">
            {form.getFieldDecorator('username', {
              rules: [
                {
                  required: true,
                  message: '请输入合法的用户邮箱！',
                  pattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/i,
                },
              ],
              initialValue: values.username,
            })(
              <Input
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="请输入用户名"
              />
            )}
          </FormItem>
          <FormItem label="密码">
            {form.getFieldDecorator('password', {
              rules: [
                {
                  required: false,
                  message: '请输入密码！至少8位，需同时包括字母和数字',
                  pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/i,
                },
                {
                  validator: this.validateToNextPassword,
                },
              ],
              initialValue: 'xxxxxxxx1234',
            })(
              <Input
                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                type="password"
                placeholder="请输入密码"
              />
            )}
          </FormItem>
          <Form.Item label="确认密码">
            {form.getFieldDecorator('confirm', {
              rules: [
                {
                  required: false,
                  message: '请输入密码！',
                },
                {
                  validator: this.compareToFirstPassword,
                },
              ],
              initialValue: 'xxxxxxxx1234',
            })(
              <Input
                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                type="password"
                placeholder="请输入密码"
                onBlur={this.handleConfirmBlur}
              />
            )}
          </Form.Item>
          <Form.Item label="锁定">
            {form.getFieldDecorator('locked', {
              rules: [
                {
                  required: false,
                },
              ],
            })(<Switch defaultChecked={values.locked} />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

/**
 * 用户列表
 */
@connect(({ oauthUsers, loading }) => ({
  oauthUsers,
  loading: loading.models.oauthUsers,
}))
@Form.create()
class OauthUser extends PureComponent {
  state = {
    addModalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    updateFormValues: {},
    deleteConfirmVisible: false,
  };

  columns = [
    {
      title: '用户名（邮箱）',
      dataIndex: 'username',
    },
    {
      title: '状态',
      dataIndex: 'enabled',
      render(val) {
        return <Badge status={val ? 'processing' : 'default'} text={val ? '可用' : '禁用'} />;
      },
    },
    {
      title: '锁定',
      dataIndex: 'locked',
      render(val) {
        const tooltip = !!val ? '已锁定' : '未锁定';
        return <Switch disabled={true} defaultChecked={val} checked={val} />;
      },
    },
    {
      title: '有效期',
      dataIndex: 'expireDate',
      render(val) {
        if (!!val) {
          return (
            <span>
              {Moment(val)
                .utc()
                .local()
                .format('YYYY-MM-DD HH:mm:ss')}
            </span>
          );
        } else {
          return <span>永久有效</span>;
        }
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      render(val) {
        return (
          <span>
            {Moment(val)
              .utc()
              .local()
              .format('YYYY-MM-DD HH:mm:ss')}
          </span>
        );
      },
    },
    {
      title: '操作',
      render: (test, record) => (
        <Fragment>
          <a onClick={() => this.handleUpdateModalVisible(true, record)}>编辑</a>
        </Fragment>
      ),
    },
  ];

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleAddModalVisible = flag => {
    this.setState({
      addModalVisible: !!flag,
    });
  };

  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
      updateFormValues: record || {},
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'oauthUsers/fetch',
      payload: {},
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;

    const onAddSuccess = data => {
      message.success('新增用户成功');
      this.setState({
        pagination: {
          current: 1,
        },
      });
      dispatch({
        type: 'oauthUsers/fetch',
        payload: {},
      });
    };

    delete fields['confirm'];
    const password = fields['password'];
    const md5 = crypto
      .createHash('md5')
      .update(password)
      .digest('hex');
    fields['password'] = md5;
    fields['email'] = fields['username'];

    dispatch({
      type: 'oauthUsers/add',
      payload: fields,
      callback: onAddSuccess,
    });
  };

  handleUpdate = fields => {
    const { dispatch } = this.props;

    const onUpdateSuccess = data => {
      message.success('编辑用户成功');
      dispatch({
        type: 'oauthUsers/fetch',
        payload: {},
      });
    };

    delete fields['confirm'];
    if (fields['password'] == 'xxxxxxxx1234') {
      delete fields['password'];
    } else {
      const password = fields['password'];
      const md5 = crypto
        .createHash('md5')
        .update(password)
        .digest('hex');
      fields['password'] = md5;
    }

    dispatch({
      type: 'oauthUsers/update',
      payload: fields,
      callback: onUpdateSuccess,
    });
  };

  handleDelete = rows => {
    const { dispatch } = this.props;

    const onDeleteSuccess = data => {
      message.success('删除用户成功');
      this.setState({
        pagination: {
          current: 1,
        },
        selectedRows: [],
        deleteConfirmVisible: false,
      });
      dispatch({
        type: 'oauthUsers/fetch',
        payload: {},
      });
    };

    const ids = rows.map(row => row.id);
    dispatch({
      type: 'oauthUsers/delete',
      payload: ids,
      callback: onDeleteSuccess,
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form, pagination } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        params: fieldsValue,
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'oauthUsers/fetch',
        payload: values,
      });
    });
  };

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    this.setState({ pagination });

    dispatch({
      type: 'oauthUsers/fetch',
      payload: params,
    });
  };

  renderForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="用户名称">
              {getFieldDecorator('username')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="锁定">
              {getFieldDecorator('locked')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="true">锁定</Option>
                  <Option value="false">未锁定</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="状态">
              {getFieldDecorator('enabled')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="true">可用</Option>
                  <Option value="false">禁用</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      selectedRows,
      addModalVisible,
      updateModalVisible,
      updateFormValues,
      pagination,
      deleteConfirmVisible,
    } = this.state;

    const data = {
      pagination: {
        ...pagination,
        total: this.props.oauthUsers.total,
      },
      list: this.props.oauthUsers.list,
    };
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
      </Menu>
    );

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleAddModalVisible: this.handleAddModalVisible,
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };
    return (
      <PageHeaderWrapper title="用户列表">
        <Card bordered={false}>
          <div className={styles.oauthUser}>
            <div className={styles.oauthUserForm}>{this.renderForm()}</div>
            <div className={styles.oauthUserOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleAddModalVisible(true)}>
                新建
              </Button>
              {selectedRows.length > 0 && (
                <span>
                  <Button
                    icon="delete"
                    type="danger"
                    onClick={() => this.setState({ deleteConfirmVisible: true })}
                  >
                    删除
                  </Button>
                </span>
              )}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={this.props.loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              rowKey={record => record.id}
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={addModalVisible} />
        {updateFormValues && Object.keys(updateFormValues).length ? (
          <UpdateForm
            {...updateMethods}
            modalVisible={updateModalVisible}
            values={updateFormValues}
          />
        ) : null}

        <Modal
          title="确认删除"
          visible={deleteConfirmVisible}
          onOk={() => this.handleDelete(selectedRows)}
          onCancel={() => this.setState({ deleteConfirmVisible: false })}
        >
          <p>确认删除选中用户？</p>
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default OauthUser;
