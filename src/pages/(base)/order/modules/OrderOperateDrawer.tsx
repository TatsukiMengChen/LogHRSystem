import { Button, DatePicker, Drawer, Flex, Form, Input } from 'antd';
import type { FC } from 'react';

import { useFormRules } from '@/features/form';

type Model = Pick<Api.OrderManage.Order, 'customerInfo' | 'deliveryTime' | 'items' | 'name' | 'price' | 'sentOutTime'>;

type RuleKey = Extract<keyof Model, 'name'>;

const OrderOperateDrawer: FC<Page.OperateDrawerProps> = ({ form, handleSubmit, onClose, open, operateType }) => {
  const { t } = useTranslation();

  const { defaultRequiredRule } = useFormRules();

  const rules: Record<RuleKey, App.Global.FormRule> = {
    name: defaultRequiredRule
  };

  return (
    <Drawer
      open={open}
      title={operateType === 'add' ? t('添加订单') : t('编辑订单')}
      footer={
        <Flex justify="space-between">
          <Button onClick={onClose}>{t('common.cancel')}</Button>
          <Button
            type="primary"
            onClick={handleSubmit}
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
        >
          <DatePicker
            showTime
            placeholder={t('请选择发货时间')}
            style={{ width: '100%' }}
          />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default OrderOperateDrawer;
