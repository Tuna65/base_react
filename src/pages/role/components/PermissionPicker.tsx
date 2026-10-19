import { Button, Checkbox } from "@/components";
import type { PermissionOption } from "@/apis/role";
type Props = {
  value?: string[];
  onChange?: (value: string[]) => void;
  options: PermissionOption[];
  disabled?: boolean;
};
export default function PermissionPicker({ value = [], onChange, options, disabled }: Props) {
  const groups = options.reduce<Record<string, PermissionOption[]>>((result, option) => {
    (result[option.group] ??= []).push(option);
    return result;
  }, {});
  const assignable = options.filter((option) => option.assignable).map((option) => option.value);
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-[#93909f]">
          {value.length} / {options.length} selected
        </span>
        <div className="flex gap-2">
          <Button size="small" disabled={disabled} onClick={() => onChange?.([...new Set([...value, ...assignable])])}>
            Select all
          </Button>
          <Button
            size="small"
            disabled={disabled}
            onClick={() => onChange?.(value.filter((permission) => !assignable.includes(permission)))}
          >
            Clear
          </Button>
        </div>
      </div>
      {Object.entries(groups).map(([group, permissions]) => (
        <div key={group} className="rounded-lg border border-solid border-[#e7e5ee] p-4 dark:border-[#27252e]">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-semibold uppercase">{group}</span>
            <Button
              size="small"
              type="text"
              disabled={disabled}
              onClick={() =>
                onChange?.([
                  ...new Set([
                    ...value,
                    ...permissions.filter((permission) => permission.assignable).map((permission) => permission.value),
                  ]),
                ])
              }
            >
              Select group
            </Button>
          </div>
          <Checkbox.Group
            className="!grid !w-full !grid-cols-1 !gap-3 sm:!grid-cols-2"
            value={value.filter((permission) => permissions.some((option) => option.value === permission))}
            disabled={disabled}
            options={permissions.map((permission) => ({
              label: permission.label,
              value: permission.value,
              disabled: !permission.assignable,
            }))}
            onChange={(selected) =>
              onChange?.([
                ...value.filter(
                  (permission) => !permissions.some((option) => option.value === permission && option.assignable),
                ),
                ...selected.map(String),
              ])
            }
          />
        </div>
      ))}
    </div>
  );
}
