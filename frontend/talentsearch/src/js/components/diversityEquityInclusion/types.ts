import type { UpdateUserAsUserMutation } from "../../api/generated";

export type UserMutationPromise = Promise<
  UpdateUserAsUserMutation["updateUserAsUser"]
>;

export type EquityKeys =
  | "isWoman"
  | "isIndigenous"
  | "isVisibleMinority"
  | "hasDisability";

export interface EquityDialogProps {
  isOpen: boolean;
  isAdded: boolean;
  onDismiss: () => void;
  onSave: (value: boolean) => void;
}

export type EquityDialogFooterProps = Pick<
  EquityDialogProps,
  "isAdded" | "onSave"
>;
