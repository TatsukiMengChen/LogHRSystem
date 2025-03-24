export interface ModulesProps {
  onClose: () => void;
  open: boolean;
  roleId: number;
  routes: string[];
  setFormData: (data: { home: string; menus: string[]; roleId: number }) => void;
}
