import { Button, Drawer, Flex, Form, Input } from 'antd';
import type { FC } from 'react';

import { useFormRules } from '@/features/form';

type Model = Pick<Api.GoodManage.Good, 'class' | 'desc' | 'inventory' | 'name' | 'repo' | 'status' | 'weight'>;

type RuleKey = Extract<keyof Model, 'name'>;

const GoodOperateDrawer: FC<Page.OperateDrawerProps> = ({ form, handleSubmit, onClose, open, operateType }) => {
  const { t } = useTranslation();

  const { defaultRequiredRule } = useFormRules();

  const rules: Record<RuleKey, App.Global.FormRule> = {
    name: defaultRequiredRule
  };

  return (
    <Drawer
      open={open}
      title={operateType === 'add' ? t('添加商品') : t('编辑商品')}
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
          label={t('名称')}
          name="name"
          rules={[rules.name]}
        >
          <Input placeholder={t('请输入商品名称')} />
        </Form.Item>

        <Form.Item
          label={t('仓库')}
          name="repo"
        >
          <Input placeholder={t('请输入仓库')} />
        </Form.Item>

        <Form.Item
          label={t('分类')}
          name="class"
        >
          <Input placeholder={t('请输入分类')} />
        </Form.Item>

        <Form.Item
          label={t('库存')}
          name="inventory"
        >
          <Input placeholder={t('请输入库存')} />
        </Form.Item>

        <Form.Item
          label={t('重量')}
          name="weight"
        >
          <Input placeholder={t('请输入重量')} />
        </Form.Item>

        <Form.Item
          label={t('备注')}
          name="desc"
        >
          <Input.TextArea
            placeholder={t('请输入备注')}
            rows={4}
          />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default GoodOperateDrawer;
