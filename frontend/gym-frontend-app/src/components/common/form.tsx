// src/components/common/Form.tsx

import { FormProps } from '../../types/components/common.types';



export default function Form({ children, spacing = 'normal', className = '', ...props }: FormProps) {
  const spacingClasses = {
    tight: 'space-y-2',
    normal: 'space-y-4',
    loose: 'space-y-6'
  };

  return (
    <form className={`${spacingClasses[spacing]} ${className}`} {...props}>
      {children}
    </form>
  );
}