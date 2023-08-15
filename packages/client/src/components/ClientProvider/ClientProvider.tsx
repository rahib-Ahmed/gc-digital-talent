import { authExchange } from "@urql/exchange-auth";
import jwtDecode, { JwtPayload } from "jwt-decode";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import {
  Client,
  CombinedError,
  createClient,
  dedupExchange,
  cacheExchange,
  fetchExchange,
  errorExchange,
  Provider,
  Operation,
  makeOperation,
  AnyVariables,
} from "urql";
import { useIntl } from "react-intl";

import { useAuthentication } from "@gc-digital-talent/auth";
import { useLogger } from "@gc-digital-talent/logger";
import { toast } from "@gc-digital-talent/toast";

import {
  buildValidationErrorMessageNode,
  extractErrorMessages,
  extractValidationMessageKeys,
} from "../../utils/errors";

// generate nonce somewhere here?
// const nonce = ...

const apiUri = process.env.API_URI ?? "http://localhost:8000/graphql";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  idToken: string | null;
}

const addAuthToOperation = ({
  authState,
  operation,
}: {
  authState: AuthState | null;
  operation: Operation;
}): Operation => {
  if (!authState || !authState.accessToken) {
    return operation;
  }

  const fetchOptions =
    typeof operation.context.fetchOptions === "function"
      ? operation.context.fetchOptions()
      : operation.context.fetchOptions || {};

  return makeOperation(operation.kind, operation, {
    ...operation.context,
    fetchOptions: {
      ...fetchOptions,
      headers: {
        ...fetchOptions.headers,
        Authorization: `Bearer ${authState.accessToken}`,
      },
    },
  });
};

const didAuthError = ({ error }: { error: CombinedError }): boolean => {
  return error && error.response
    ? error.response.status === 401 ||
        error.graphQLErrors.some(
          (e) => e.extensions?.category === "authentication",
        )
    : false;
};

const willAuthError = ({ authState }: { authState: AuthState | null }) => {
  let tokenIsKnownToBeExpired = false;
  if (authState?.accessToken) {
    const decoded = jwtDecode<JwtPayload>(authState.accessToken);
    if (decoded.exp) tokenIsKnownToBeExpired = Date.now() > decoded.exp * 1000; // JWT expiry date in seconds, not milliseconds
  }

  if (tokenIsKnownToBeExpired) return true;

  return false;
};

const ClientProvider = ({
  client,
  children,
}: {
  client?: Client;
  children?: React.ReactNode;
}) => {
  const intl = useIntl();
  const authContext = useAuthentication();
  const logger = useLogger();
  // Create a mutable object to hold the auth state
  const authRef = useRef(authContext);
  // Keep the contents of that mutable object up to date
  useEffect(() => {
    authRef.current = authContext;
  }, [authContext]);

  const getAuth: (params: {
    authState: AuthState | null;
  }) => Promise<AuthState | null> = useCallback(
    async ({ authState: existingAuthState }) => {
      // getAuth could be called for the first request or as the result of an error

      // At runtime, get the current auth state
      const { accessToken, refreshToken, idToken, logout, refreshTokenSet } =
        authRef.current;

      if (!existingAuthState) {
        // no existing auth state so this is probably just the first request
        if (accessToken) {
          return { accessToken, refreshToken, idToken };
        }
        return null;
      }

      /**
       * Logout the user and return null AuthState
       *
       * @returns null
       */
      const logoutNullState = () => {
        const currentLocation = window.location.pathname; // Can't use react-router hooks because we may not be inside the Router context.
        logout(currentLocation); // After logging out, try to return to the page the user was on.
        return null;
      };

      // If authState is not null, and getAuth is called again, then it means authentication failed for some reason.
      // let's try to use a refresh token to get new tokens
      if (refreshToken) {
        const refreshedAuthState = await refreshTokenSet();
        if (refreshedAuthState) {
          return refreshedAuthState;
        }

        return logoutNullState();
      }

      return logoutNullState();
    },
    // This function is inside of `useCallback` to prevent breaking the memoization of internalClient.
    // If internalClient is re-instantiated it will lose its error count and can cause refresh loops.
    [],
  );

  const internalClient = useMemo(() => {
    return (
      client ??
      createClient({
        url: apiUri,
        requestPolicy: "cache-and-network",
        exchanges: [
          errorExchange({
            onError: (
              error: CombinedError,
              operation: Operation<unknown, AnyVariables>,
            ) => {
              let errorMessages = extractErrorMessages(error);

              const validationMessageKeys = extractValidationMessageKeys(error);
              if (validationMessageKeys) {
                errorMessages = validationMessageKeys;
              }

              const errorMessageNode = buildValidationErrorMessageNode(
                errorMessages,
                intl,
              );
              if (errorMessageNode) toast.error(errorMessageNode);

              if (error.graphQLErrors || error.networkError) {
                logger.error(
                  JSON.stringify({
                    message: "ClientProvider onError",
                    error,
                    operation,
                  }),
                );
              }
            },
          }),
          dedupExchange,
          cacheExchange,
          authExchange({
            getAuth,
            addAuthToOperation,
            didAuthError,
            willAuthError,
          }),
          fetchExchange,
        ],
      })
    );
  }, [client, getAuth, intl, logger]);

  return <Provider value={internalClient}>{children}</Provider>;
};

export default ClientProvider;

// https://stackoverflow.com/questions/54116070/how-can-i-unit-test-non-exported-functions
export const exportedForTesting = {
  willAuthError,
  extractErrorMessages,
};
