import { FieldLabels } from "@gc-digital-talent/forms";
import {
  Maybe,
  Pool,
  PoolCandidate,
  UpdateUserAsUserInput,
  UpdateUserAsUserMutation,
  UserProfileFragment as UserProfileFragmentType,
} from "@gc-digital-talent/graphql";

export type SectionKey =
  | "personal"
  | "work"
  | "dei"
  | "government"
  | "language"
  | "account";

export interface SectionProps<P = void> {
  user: UserProfileFragmentType;
  isUpdating?: boolean;
  application?: Pick<PoolCandidate, "id"> & { pool: Pick<Pool, "language"> };
  pool?: Maybe<P>;
  onUpdate: (
    id: string,
    user: UpdateUserAsUserInput,
  ) => Promise<UpdateUserAsUserMutation["updateUserAsUser"]>;
}

export interface FormFieldProps {
  labels: FieldLabels;
}
