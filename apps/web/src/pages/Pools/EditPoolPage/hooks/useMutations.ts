import { useNavigate } from "react-router-dom";
import { useIntl } from "react-intl";

import { toast } from "@gc-digital-talent/toast";

import useRoutes from "~/hooks/useRoutes";
import {
  useClosePoolMutation,
  useDeletePoolMutation,
  useDuplicatePoolMutation,
  usePublishPoolMutation,
  useUpdatePoolMutation,
  useChangePoolClosingDateMutation,
  UpdatePoolInput,
  Scalars,
} from "~/api/generated";

const useMutations = () => {
  const intl = useIntl();
  const paths = useRoutes();
  const navigate = useNavigate();

  const navigateBack = () => navigate(paths.poolTable());

  const [{ fetching: updateFetching }, executeUpdateMutation] =
    useUpdatePoolMutation();

  const handleUpdateError = () => {
    toast.error(
      intl.formatMessage({
        defaultMessage: "Error: updating pool failed",
        id: "2TrYLI",
        description:
          "Message displayed to user after pool fails to get updated.",
      }),
    );
  };

  const update = async (id: string, pool: UpdatePoolInput) => {
    await executeUpdateMutation({ id, pool })
      .then((result) => {
        if (result.data?.updatePool) {
          toast.success(
            intl.formatMessage({
              defaultMessage: "Pool updated successfully!",
              id: "nPUAz5",
              description: "Message displayed to user after pool is updated",
            }),
          );
        } else {
          handleUpdateError();
        }
      })
      .catch(handleUpdateError);
  };

  const [{ fetching: extendFetching }, executeExtendMutation] =
    useChangePoolClosingDateMutation();

  const extend = async (id: string, closingDate: Scalars["DateTime"]) => {
    await executeExtendMutation({ id, closingDate })
      .then((result) => {
        if (result.data?.changePoolClosingDate) {
          toast.success(
            intl.formatMessage({
              defaultMessage: "Pool updated successfully!",
              id: "nPUAz5",
              description: "Message displayed to user after pool is updated",
            }),
          );
        } else {
          handleUpdateError();
        }
      })
      .catch(handleUpdateError);
  };

  const [{ fetching: publishFetching }, executePublishMutation] =
    usePublishPoolMutation();

  const handlePublishError = () => {
    toast.error(
      intl.formatMessage({
        defaultMessage: "Error: publishing pool failed",
        id: "TkTpzk",
        description:
          "Message displayed to user after pool fails to get publish.",
      }),
    );
  };

  const publish = (id: string) => {
    executePublishMutation({ id })
      .then((result) => {
        if (result.data?.publishPool) {
          navigateBack();
          toast.success(
            intl.formatMessage({
              defaultMessage: "Pool published successfully!",
              id: "P5+9Wy",
              description: "Message displayed to user after pool is published",
            }),
          );
        } else {
          handlePublishError();
        }
      })
      .catch(handlePublishError);
  };

  const [{ fetching: closeFetching }, executeCloseMutation] =
    useClosePoolMutation();

  const handleCloseError = () => {
    toast.error(
      intl.formatMessage({
        defaultMessage: "Error: closing pool failed",
        id: "dYBwCh",
        description:
          "Message displayed to user after pool fails to get closed.",
      }),
    );
  };

  const close = (id: string) => {
    executeCloseMutation({ id })
      .then((result) => {
        if (result.data?.closePool) {
          navigateBack();
          toast.success(
            intl.formatMessage({
              defaultMessage: "Pool closed successfully!",
              id: "JJB5Yd",
              description: "Message displayed to user after pool is closed",
            }),
          );
        } else {
          handleCloseError();
        }
      })
      .catch(handleCloseError);
  };

  const [{ fetching: deleteFetching }, executeDeleteMutation] =
    useDeletePoolMutation();

  const handleDeleteError = () => {
    toast.error(
      intl.formatMessage({
        defaultMessage: "Error: closing pool failed",
        id: "RXoZOS",
        description:
          "Message displayed to user after pool fails to get deleted.",
      }),
    );
  };

  const deletePool = (id: string) => {
    executeDeleteMutation({ id })
      .then((result) => {
        navigateBack();
        if (result.data?.deletePool) {
          toast.success(
            intl.formatMessage({
              defaultMessage: "Pool deleted successfully!",
              id: "93AuFS",
              description: "Message displayed to user after pool is deleted",
            }),
          );
        } else {
          handleDeleteError();
        }
      })
      .catch(handleDeleteError);
  };

  const [{ fetching: duplicateFetching }, executeDuplicateMutation] =
    useDuplicatePoolMutation();

  const handleDuplicateError = () => {
    toast.error(
      intl.formatMessage({
        defaultMessage:
          "Error: Something went wrong, please try again in a minute or contact your administrator.",
        id: "hHYn/8",
        description:
          "Message displayed to user after pool fails to get duplicated.",
      }),
    );
  };

  const duplicatePool = (id: string, teamId: string) => {
    executeDuplicateMutation({ id, teamId })
      .then((result) => {
        navigateBack();
        if (result.data?.duplicatePool?.id) {
          toast.success(
            intl.formatMessage({
              defaultMessage:
                "Success: This pool has been duplicated successfully.",
              id: "vlyq02",
              description: "Message displayed to user after pool is deleted",
            }),
          );
          navigate(paths.poolUpdate(result.data.duplicatePool.id));
        } else {
          handleDuplicateError();
        }
      })
      .catch(handleDuplicateError);
  };

  return {
    isFetching:
      updateFetching ||
      extendFetching ||
      publishFetching ||
      closeFetching ||
      deleteFetching ||
      duplicateFetching,
    mutations: {
      update,
      extend,
      publish,
      close,
      delete: deletePool,
      duplicate: duplicatePool,
    },
  };
};

export default useMutations;
