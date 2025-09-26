import { useMemo } from 'react';
import { SelectOption } from '@/components/atoms';

// Hook para converter dados de endpoint em opções do select
export const useEndpointOptions = <T extends Record<string, any>>(
  data: T[],
  valueKey: keyof T,
  labelKey: keyof T,
  placeholder?: string
): SelectOption[] => {
  return useMemo(() => {
    const options: SelectOption[] = [];
    
    if (placeholder) {
      options.push({
        value: '',
        label: placeholder,
        disabled: true,
      });
    }
    
    options.push(
      ...data.map((item) => ({
        value: String(item[valueKey]),
        label: String(item[labelKey]),
      }))
    );
    
    return options;
  }, [data, valueKey, labelKey, placeholder]);
};

// Hook para converter enums em opções do select
export const useEnumOptions = (
  enumObject: Record<string, string>,
  translations?: Record<string, string>,
  placeholder?: string
): SelectOption[] => {
  return useMemo(() => {
    const options: SelectOption[] = [];
    
    if (placeholder) {
      options.push({
        value: '',
        label: placeholder,
        disabled: true,
      });
    }
    
    options.push(
      ...Object.entries(enumObject).map(([key, value]) => ({
        value: value,
        label: translations?.[value] || key,
      }))
    );
    
    return options;
  }, [enumObject, translations, placeholder]);
};

// Hook para opções customizadas
export const useCustomOptions = (
  options: Array<{ value: string | number; label: string; disabled?: boolean }>,
  placeholder?: string
): SelectOption[] => {
  return useMemo(() => {
    const selectOptions: SelectOption[] = [];
    
    if (placeholder) {
      selectOptions.push({
        value: '',
        label: placeholder,
        disabled: true,
      });
    }
    
    selectOptions.push(...options);
    
    return selectOptions;
  }, [options, placeholder]);
};
