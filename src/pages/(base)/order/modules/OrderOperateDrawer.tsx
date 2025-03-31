import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, DatePicker, Drawer, Flex, Form, Input, InputNumber, Select } from 'antd';
import dayjs from 'dayjs';
import type { FC } from 'react';
import { useEffect, useState } from 'react';

import { useFormRules } from '@/features/form';
import { Api } from '@/service/api';

type Model = Pick<Api.OrderManage.Order, 'customerInfo' | 'deliveryTime' | 'items' | 'name' | 'price' | 'sentOutTime'>;

type RuleKey = Extract<keyof Model, 'name'>;

const OrderOperateDrawer: FC<Page.OperateDrawerProps> = ({ form, handleSubmit, onClose, open, operateType }) => {
  const { t } = useTranslation();
  const { defaultRequiredRule } = useFormRules();
  const [goodsList, setGoodsList] = useState<Api.GoodManage.Good[]>([]);
  const [loading, setLoading] = useState(false);

  // 获取商品列表
  const fetchGoodsList = async () => {
    try {
      setLoading(true);
      const response = await Api.Good.getGoodList();
      if (response?.data?.records) {
        setGoodsList(response.data.records);
      }
    } catch (error) {
      console.error('获取商品列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 加载商品列表数据
  useEffect(() => {
    if (open) {
      fetchGoodsList();
    }
  }, [open]);

  const rules: Record<RuleKey, App.Global.FormRule> = {
    name: defaultRequiredRule
  };

  // 处理商品选择逻辑
  const handleGoodSelect = (value: number, index: number) => {
    const selectedGood = goodsList.find(good => good.id === value);
    if (selectedGood) {
      const items = form.getFieldValue('items') || [];
      // 设置选中商品的名称
      form.setFieldsValue({
        items: items.map((item: any, idx: number) => {
          if (idx === index) {
            return {
              ...item,
              id: selectedGood.id,
              name: selectedGood.name,
              // 可以选择是否自动设置其他字段
              weight: selectedGood.weight.toString()
            };
          }
          return item;
        })
      });
    }
  };

  // 在表单提交前处理日期格式
  const onSubmit = () => {
    // 处理日期字段，确保提交前转换为正确的格式
    const values = form.getFieldsValue();
    if (values.deliveryTime && dayjs.isDayjs(values.deliveryTime)) {
      values.deliveryTime = values.deliveryTime.format('YYYY-MM-DD HH:mm:ss');
    }
    if (values.sentOutTime && dayjs.isDayjs(values.sentOutTime)) {
      values.sentOutTime = values.sentOutTime.format('YYYY-MM-DD HH:mm:ss');
    }
    form.setFieldsValue(values);
    handleSubmit();
  };

  return (
    <Drawer
      open={open}
      title={operateType === 'add' ? t('添加订单') : t('编辑订单')}
      width={600}
      footer={
        <Flex justify="space-between">
          <Button onClick={onClose}>{t('common.cancel')}</Button>
          <Button
            type="primary"
            onClick={onSubmit}
          >
            {t('common.confirm')}
          </Button>
        </Flex>
      }
      onClose={onClose}
    >
      <Form
        form={form}
        layout="vertical"
      >
        <Form.Item
          label={t('订单名称')}
          name="name"
          rules={[rules.name]}
        >
          <Input placeholder={t('请输入订单名称')} />
        </Form.Item>

        <Form.Item
          label={t('订单价格')}
          name="price"
        >
          <Input placeholder={t('请输入订单价格')} />
        </Form.Item>

        <Form.Item
          label={t('交付时间')}
          name="deliveryTime"
          getValueProps={value => ({
            value: value ? dayjs(value) : undefined
          })}
        >
          <DatePicker
            showTime
            placeholder={t('请选择交付时间')}
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item
          label={t('发货时间')}
          name="sentOutTime"
          getValueProps={value => ({
            value: value ? dayjs(value) : undefined
          })}
        >
          <DatePicker
            showTime
            placeholder={t('请选择发货时间')}
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Card
          size="small"
          style={{ marginBottom: '20px' }}
          title={t('客户信息')}
        >
          <Form.Item
            label={t('客户名称')}
            name={['customerInfo', 'name']}
            rules={[{ message: t('请输入客户名称'), required: true }]}
          >
            <Input placeholder={t('请输入客户名称')} />
          </Form.Item>

          <Form.Item
            label={t('联系电话')}
            name={['customerInfo', 'phone']}
            rules={[{ message: t('请输入联系电话'), required: true }]}
          >
            <Input placeholder={t('请输入联系电话')} />
          </Form.Item>

          <Form.Item
            label={t('客户地址')}
            name={['customerInfo', 'address']}
            rules={[{ message: t('请输入客户地址'), required: true }]}
          >
            <Input.TextArea
              placeholder={t('请输入客户地址')}
              rows={2}
            />
          </Form.Item>
        </Card>

        <Card
          size="small"
          title={t('订单项目')}
        >
          <Form.List name="items">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }, index) => (
                  <Card
                    key={key}
                    size="small"
                    style={{ marginBottom: '10px' }}
                    extra={
                      <MinusCircleOutlined
                        style={{ color: '#ff4d4f' }}
                        onClick={() => remove(name)}
                      />
                    }
                  >
                    <Form.Item
                      {...restField}
                      label={t('选择商品')}
                      name={[name, 'id']}
                      rules={[{ message: t('请选择商品'), required: true }]}
                    >
                      <Select
                        loading={loading}
                        placeholder={t('请选择商品')}
                        options={goodsList.map(good => ({
                          label: `${good.name} (库存: ${good.inventory})`,
                          value: good.id
                        }))}
                        onChange={value => handleGoodSelect(value, index)}
                      />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      label={t('数量')}
                      name={[name, 'quantity']}
                      rules={[{ message: t('请输入数量'), required: true }]}
                    >
                      <InputNumber
                        min={1}
                        placeholder={t('请输入数量')}
                        style={{ width: '100%' }}
                      />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      label={t('重量')}
                      name={[name, 'weight']}
                    >
                      <Input
                        disabled
                        placeholder={t('自动填充重量')}
                      />
                    </Form.Item>
                  </Card>
                ))}
                <Form.Item>
                  <Button
                    block
                    icon={<PlusOutlined />}
                    type="dashed"
                    onClick={() => add()}
                  >
                    {t('添加商品项')}
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Card>
      </Form>
    </Drawer>
  );
};

export default OrderOperateDrawer;
